export const wordList = [
  // Animals
  'cat', 'dog', 'fish', 'bird', 'elephant', 'lion', 'tiger', 'bear', 'horse', 'cow',
  'pig', 'sheep', 'goat', 'chicken', 'duck', 'rabbit', 'mouse', 'frog', 'snake', 'turtle',
  'monkey', 'zebra', 'giraffe', 'hippo', 'rhino', 'kangaroo', 'panda', 'koala', 'owl', 'eagle',
  
  // Food
  'pizza', 'burger', 'cake', 'cookie', 'bread', 'cheese', 'apple', 'banana', 'orange', 'grape',
  'strawberry', 'watermelon', 'carrot', 'broccoli', 'tomato', 'potato', 'corn', 'rice', 'pasta', 'salad',
  'sandwich', 'soup', 'ice cream', 'candy', 'chocolate', 'coffee', 'tea', 'milk', 'juice', 'water',
  
  // Objects
  'chair', 'table', 'bed', 'door', 'window', 'lamp', 'book', 'pen', 'pencil', 'paper',
  'computer', 'phone', 'car', 'bike', 'plane', 'train', 'boat', 'house', 'tree', 'flower',
  'clock', 'mirror', 'umbrella', 'shoe', 'hat', 'shirt', 'pants', 'dress', 'bag', 'key',
  
  // Activities
  'running', 'jumping', 'swimming', 'dancing', 'singing', 'reading', 'writing', 'drawing', 'cooking', 'sleeping',
  'playing', 'walking', 'driving', 'flying', 'sailing', 'climbing', 'fishing', 'gardening', 'shopping', 'cleaning',
  
  // Nature
  'sun', 'moon', 'star', 'cloud', 'rain', 'snow', 'wind', 'ocean', 'river', 'mountain',
  'forest', 'desert', 'island', 'beach', 'volcano', 'rainbow', 'lightning', 'earthquake', 'tornado', 'hurricane',
  
  // Simple Concepts
  'happy', 'sad', 'angry', 'scared', 'excited', 'tired', 'hot', 'cold', 'big', 'small',
  'fast', 'slow', 'loud', 'quiet', 'light', 'dark', 'clean', 'dirty', 'new', 'old',
  
  // Sports
  'football', 'basketball', 'tennis', 'golf', 'baseball', 'soccer', 'hockey', 'swimming', 'boxing', 'wrestling',
  
  // Professions
  'doctor', 'teacher', 'police', 'firefighter', 'chef', 'artist', 'musician', 'pilot', 'sailor', 'farmer'
];

export function getRandomWords(count: number): string[] {
  const shuffled = [...wordList].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomWord(): string {
  return wordList[Math.floor(Math.random() * wordList.length)];
}
