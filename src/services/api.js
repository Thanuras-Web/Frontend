export const predictCallVolume = async (data) => {
  try {
    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    return { error: 'Prediction failed' };
  }
};
