import express from 'express';
import passport from 'passport';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { applyCreate, removeApply, getTeamApply, getDetailApply, modifyApply } from '../../controller/showu/teamApplyController.js';

// ES Modules에서 __dirname 설정
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

// 디렉토리를 생성
const createUploadFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

// 파일 이름 중복 처리
const uploadFolder = "uploads/team/apply"
const getUniqueFileName = (originalName, uploadFolder) => {
  const ext = path.extname(originalName); //확장자를 추출
  const baseName = path.basename(originalName, ext) //확장자를 제외한 파일 이름
  let uniqueName = originalName; //기본적으로 원본 이미지 저장
  let counter = 1;

  while(fs.existsSync(path.join(uploadFolder, uniqueName))){
    uniqueName = `${baseName}(${counter})${ext}`
    counter++;
  }
  return uniqueName;
}

// Multer 이미지 업로드
const upload = multer({
  storage : multer.diskStorage({
    destination(req, file, done){
      console.log(req.path)
      const uploadPath = path.join(__dirname, "../../uploads/showu/apply");
      console.log(`Saving file to: ${uploadPath}`);
      done(null, uploadPath) // 이미지 저장 경로 설정
    },
    filename(req, file, done){
      // 파일 이름을 UTF-8로 변환
      const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
      const uniqueFileName = getUniqueFileName(originalName, uploadFolder)
      done(null, uniqueFileName) //파일 이름을 설정
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB 제한
  },
})

const applyRouter = express.Router();
const TeamApplyFileUploadMiddleWare = upload.single('portfilo');

createUploadFolder(path.join(__dirname, "../../uploads/showu/apply"));

// 팀 매칭 지원 'showu/team/apply/create/:id'
applyRouter.post("/create/:id", passport.authenticate('jwt', { session : false }), TeamApplyFileUploadMiddleWare, applyCreate)

// 팀 지원 삭제 '/shouw/team/apply/remove/:applyId'
applyRouter.delete("/remove/:applyId", passport.authenticate('jwt', { session : false }), removeApply)

// 팀 지원한 목록 '/showu/team/apply/'
applyRouter.get("/" , passport.authenticate('jwt', { session : false }), getTeamApply)

// 팀 지원한 상세 정보 '/showu/team/apply/:id'
applyRouter.get("/:id", passport.authenticate('jwt', { session : false }), getDetailApply)

// 팀 지원 수정 '/showu/team/apply/modify/:id'
applyRouter.put("/modify/:id", passport.authenticate('jwt', { session : false }), TeamApplyFileUploadMiddleWare, modifyApply)

export default applyRouter;