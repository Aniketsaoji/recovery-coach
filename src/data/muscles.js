export const MUSCLES = {
  'trapezius': {
    name: 'Trapezius',
    description: 'Upper back and neck muscle spanning from skull to mid-back. Commonly tight from desk work and poor posture.',
    color: '#3b82f6',
    keywords: ['neck', 'trap', 'upper back', 'shoulder blade', 'between shoulders', 'stiff neck', 'trapezius', 'neck pain', 'neck stiffness'],
    category: 'upper_body',
    view: ['front', 'back']
  },
  'chest': {
    name: 'Chest (Pectorals)',
    description: 'Major chest muscles responsible for pushing movements and shoulder protraction.',
    color: '#3b82f6',
    keywords: ['chest', 'pec', 'sternum', 'breast', 'pectoral', 'chest pain', 'chest tightness'],
    category: 'upper_body',
    view: ['front']
  },
  'front-deltoids': {
    name: 'Shoulders',
    description: 'Deltoid and rotator cuff muscles that stabilize and move the shoulder joint.',
    color: '#60a5fa',
    keywords: ['shoulder', 'deltoid', 'rotator cuff', 'front shoulder', 'shoulder pain', 'shoulder stiffness', 'overhead pain', 'rotator'],
    category: 'upper_body',
    view: ['front', 'back']
  },
  'biceps': {
    name: 'Biceps',
    description: 'Front of the upper arm muscle responsible for elbow flexion and forearm supination.',
    color: '#3b82f6',
    keywords: ['bicep', 'front of arm', 'upper arm', 'biceps', 'front arm', 'elbow bend'],
    category: 'upper_body',
    view: ['front']
  },
  'triceps': {
    name: 'Triceps',
    description: 'Back of the upper arm muscle responsible for elbow extension.',
    color: '#3b82f6',
    keywords: ['tricep', 'back of arm', 'upper arm', 'triceps', 'back arm', 'elbow straighten'],
    category: 'upper_body',
    view: ['back']
  },
  'forearm': {
    name: 'Forearms',
    description: 'Forearm muscles controlling wrist and grip. Often affected by repetitive strain.',
    color: '#60a5fa',
    keywords: ['forearm', 'wrist', 'elbow', 'tennis elbow', 'golfer elbow', 'grip', 'wrist pain', 'forearm pain', 'carpal'],
    category: 'upper_body',
    view: ['front', 'back']
  },
  'upper-back': {
    name: 'Upper Back',
    description: 'Rhomboids and mid-trapezius responsible for scapular retraction and posture.',
    color: '#6366f1',
    keywords: ['upper back', 'rhomboid', 'between shoulder blades', 'mid back', 'upper back pain', 'mid back pain', 'scapula', 'shoulder blade pain'],
    category: 'upper_body',
    view: ['back']
  },
  'lower-back': {
    name: 'Lower Back',
    description: 'Lumbar spine supporting muscles. One of the most common areas of chronic pain.',
    color: '#8b5cf6',
    keywords: ['lower back', 'lumbar', 'low back', 'back pain', 'lumbar pain', 'lower back pain', 'sciatica', 'sacrum', 'spine'],
    category: 'core',
    view: ['back']
  },
  'abs': {
    name: 'Core / Abs',
    description: 'Abdominal muscles providing spinal stability, posture, and trunk flexion.',
    color: '#a78bfa',
    keywords: ['core', 'abs', 'abdomen', 'stomach', 'belly', 'abdominal', 'ab pain', 'core weakness'],
    category: 'core',
    view: ['front']
  },
  'obliques': {
    name: 'Obliques',
    description: 'Side abdominal muscles responsible for rotation and lateral flexion of the trunk.',
    color: '#8b5cf6',
    keywords: ['oblique', 'side', 'flank', 'love handles', 'side pain', 'lateral core', 'side abs'],
    category: 'core',
    view: ['front']
  },
  'gluteal': {
    name: 'Glutes',
    description: 'Gluteal muscles providing hip extension, abduction, and pelvic stability.',
    color: '#14b8a6',
    keywords: ['glute', 'butt', 'buttock', 'hip', 'piriformis', 'SI joint', 'glute pain', 'hip pain', 'buttock pain', 'deep hip'],
    category: 'lower_body',
    view: ['back']
  },
  'hips': {
    name: 'Hips',
    description: 'Front and side hip area, including hip flexors, TFL, and stabilizers that influence walking, squats, and knee tracking.',
    color: '#0f766e',
    keywords: ['hip', 'hips', 'hip flexor', 'outer hip', 'side hip', 'front hip', 'TFL', 'IT band', 'iliotibial band', 'hip pain', 'hip tightness', 'hip mobility'],
    category: 'lower_body',
    view: ['front', 'back']
  },
  'hamstring': {
    name: 'Hamstrings',
    description: 'Posterior thigh muscles responsible for knee flexion and hip extension.',
    color: '#2dd4bf',
    keywords: ['hamstring', 'back of thigh', 'posterior leg', 'back of knee', 'hamstring pain', 'hamstring tightness', 'thigh back'],
    category: 'lower_body',
    view: ['back']
  },
  'quadriceps': {
    name: 'Quadriceps',
    description: 'Front thigh muscles for knee extension and stair climbing. Key for knee health.',
    color: '#14b8a6',
    keywords: ['quad', 'thigh', 'knee', 'front of thigh', 'kneecap', 'knee pain', 'patella', 'quad pain', 'thigh pain', 'front thigh'],
    category: 'lower_body',
    view: ['front']
  },
  'knees': {
    name: 'Knees',
    description: 'Knee joint area, including kneecap tracking, end-range control, and basic load tolerance for walking and stairs.',
    color: '#22c55e',
    keywords: ['knee', 'knees', 'kneecap', 'patella', 'patellar', 'joint line', 'knee pain', 'knee stiffness', 'stairs', 'squat pain', 'runner knee'],
    category: 'lower_body',
    view: ['front', 'back']
  },
  'adductors': {
    name: 'Inner Thigh',
    description: 'Inner thigh muscles for hip adduction and pelvic stability.',
    color: '#2dd4bf',
    keywords: ['inner thigh', 'groin', 'adductor', 'thigh', 'groin pain', 'inner thigh pain', 'hip adductor'],
    category: 'lower_body',
    view: ['front']
  },
  'calves': {
    name: 'Calves',
    description: 'Lower leg muscles for plantarflexion, ankle stability, and shock absorption.',
    color: '#06b6d4',
    keywords: ['calf', 'calves', 'shin', 'achilles', 'lower leg', 'ankle', 'calf pain', 'ankle pain', 'achilles pain', 'shin splints'],
    category: 'lower_body',
    view: ['back']
  },
}

export const MUSCLE_LIST = Object.entries(MUSCLES).map(([id, data]) => ({ id, ...data }))
