// 5 mức luyện tập — đồng bộ với lib/exercises.js của server.
export const levels = [
  {
    "id": 1,
    "label": "Nhập môn",
    "shortLabel": "Nền tảng",
    "range": [
      1,
      40
    ]
  },
  {
    "id": 2,
    "label": "Văn phạm & Chomsky",
    "shortLabel": "Văn phạm",
    "range": [
      41,
      80
    ]
  },
  {
    "id": 3,
    "label": "Ô-tô-mát hữu hạn",
    "shortLabel": "DFA / NFA",
    "range": [
      81,
      125
    ]
  },
  {
    "id": 4,
    "label": "Biến đổi & dạng chuẩn",
    "shortLabel": "Regex / CNF",
    "range": [
      126,
      165
    ]
  },
  {
    "id": 5,
    "label": "Nâng cao",
    "shortLabel": "PDA / chứng minh",
    "range": [
      166,
      200
    ]
  }
];

export const levelById = (id) => levels.find((level) => level.id === Number(id)) || levels[0];

export const defaultLevelCounts = {
  "1": 40,
  "2": 40,
  "3": 45,
  "4": 40,
  "5": 35
};

export const totalExercises = 200;
