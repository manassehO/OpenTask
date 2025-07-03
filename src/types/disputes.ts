export interface DisputesProps {
  id: string;
  task: string;
  submitter: string;
  company: string;
  status: 'failed' | 'pending' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dateSubmitted: string;
}
