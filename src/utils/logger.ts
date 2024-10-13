import fs from 'node:fs'
import logger from './loggerE';
import  dayjs from 'dayjs'


// src/utils/logger.ts

export const logRequest = (req: any) => {
  const { method, originalUrl, url, body } = req;
  const timestamp =  dayjs(new Date().toISOString()).format('MMMM D, YYYY h:mm A');
  const newBody = {...body}
  if(newBody?.password){
    delete newBody.password
  }
  const content = `[${timestamp}] ${method} ${originalUrl},   body: ${JSON.stringify(newBody)} \n`
  logger.info(content)
  fs.appendFile(`apilog/logreq.log`, content, err => {
    if (err) {
      console.error(err);
    }
  });
};
