import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '~/lib/auth';
import { storageService } from '~/services/storageService';
import { db } from '~/server/db';
import { tasks, taskClaims } from '~/server/db/schema';
import { eq, and } from 'drizzle-orm';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const sessionData = await auth.api.getSession({
      headers: request.headers,
    });

    if (!sessionData?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (sessionData.user.role !== 'COMPLETER') {
      return NextResponse.json(
        { error: 'Only completers can submit task files' },
        { status: 403 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const taskId = formData.get('taskId') as string;

    if (!file || !taskId) {
      return NextResponse.json(
        { error: 'File and taskId are required' },
        { status: 400 },
      );
    }

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        taskId,
      )
    ) {
      return NextResponse.json(
        { error: 'Invalid task ID format' },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit` },
        { status: 400 },
      );
    }

    const validation = storageService.validateFile(file);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const [taskData] = await db
      .select({
        id: tasks.id,
        status: tasks.status,
      })
      .from(tasks)
      .where(eq(tasks.id, taskId));

    if (!taskData) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    if (taskData.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Task is not active' },
        { status: 400 },
      );
    }

    const [claimData] = await db
      .select()
      .from(taskClaims)
      .where(
        and(
          eq(taskClaims.taskId, taskId),
          eq(taskClaims.userId, sessionData.user.id),
          eq(taskClaims.status, 'IN_PROGRESS'),
        ),
      );

    if (!claimData) {
      return NextResponse.json(
        { error: 'No active claim found for this task' },
        { status: 403 },
      );
    }

    await storageService.initialize();

    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    const uploadResult = await storageService.uploadFile({
      fileName: file.name,
      fileBuffer,
      contentType: file.type,
    });

    return NextResponse.json({
      success: true,
      fileMetadata: {
        fileName: file.name,
        fileSize: file.size,
        contentType: file.type,
        storageKey: uploadResult.key,
        url: uploadResult.url,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}
