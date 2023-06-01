const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');

const app = express();

const storage = multer.memoryStorage();

// Multer 미들웨어를 사용하여 파일 업로드 처리
const upload = multer({ dest: 'uploads/', storage: storage, buffer: true });

// EJS를 사용하기 위한 설정
app.set('view engine', 'ejs');
app.set('views', './views');

// 루트 경로 핸들러
app.get('/', (req, res) => {
  res.render('index.ejs');
});

// 파일 업로드 처리 라우트 핸들러
app.post('/fileupload', upload.single('file'), (req, res) => {
  const file = req.file;
  console.log(file);

  // AWS S3 클라이언트 생성
  const s3 = new AWS.S3();

  // S3에 파일 업로드
  const params = {
    ACL: 'public-read',
    Bucket: 'modu-hospital',
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
  };

  console.log(params);
  s3.putObject(params, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ result: 'error' });
    } else {
      res.json({ result: 'success' });
    }
  });
});

// 서버 시작
app.listen(3000, () => {
  console.log('서버가 3000 포트에서 실행 중입니다.');
});
