// Test script to check magazine creation API requirements
const testMagazineAPI = async () => {
  const testData = {
    name: "Test Magazine",
    description: "Test description",
    category: "Technology",
    type: "free",
    magzineType: "magzine",
    image: "https://example.com/test-image.jpg",
    file: "https://example.com/test-file.pdf"
  };

  try {
    const response = await fetch('https://api.echoreads.online/api/v1/admin/create-magzine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      },
      body: JSON.stringify(testData)
    });

    const data = await response.json();
    console.log('Response Status:', response.status);
    console.log('Response Data:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Uncomment to run test
// testMagazineAPI();
