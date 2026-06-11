async function test() {
  try {
    const response = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        college: 'Test College',
        department: 'CS',
        year: '3',
        email: 'test' + Date.now() + '@example.com',
        mobile: '1234567890',
        workshop: 'Web Dev',
        startDate: '2026-06-15',
        endDate: '2026-06-30'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('Success:', data);
    } else {
      console.error('Error Status:', response.status);
      console.error('Error Data:', data);
    }
  } catch (error) {
    console.error('Fetch Error:', error.message);
  }
}

test();
