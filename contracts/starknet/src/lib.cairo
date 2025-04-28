fn main() -> u32 {
    fib(16)
}

fn fib(mut n: u32) -> u32 {
    let mut a: u32 = 0;
    let mut b: u32 = 1;
    while n != 0 {
        n = n - 1;
        let temp = safe_add(b, 0); // Use safe addition
        b = safe_add(a, b);       // Use safe addition
        a = temp;
    };
    a
}

// Safe addition function to prevent overflows
fn safe_add(x: u32, y: u32) -> u32 {
    let result = x + y;
    assert(result >= x, 'Overflow detected');
    result
}

#[cfg(test)]
mod tests {
    use super::{fib, safe_add};

    #[test]
    fn it_works() {
        assert(fib(16) == 987, 'it works!');
    }

    #[test]
    fn test_safe_add() {
        assert(safe_add(1, 2) == 3, 'Safe add works');
        assert(safe_add(u32::MAX, 0) == u32::MAX, 'Safe add with max value works');
    }
}
