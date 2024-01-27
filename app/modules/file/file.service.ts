import { stringify } from 'csv-stringify/sync';
import JSZip from 'jszip';
import { ExpressionWrapper, Kysely, SqlBool } from 'kysely';
import { existsSync, readFileSync } from 'node:fs';
import { filesDirPath } from '../../common/constant/filesDirPath.constant';
import { ValidationErrorType } from '../../common/enum/errorType.enum';
import { HttpStatusCode } from '../../common/enum/httpStatusCode.enum';
import { pushDateTimeClause } from '../../common/helper/getDateBetween.helper';
import { getFileStreamFromBuffer } from '../../common/helper/getFileStream.helper';
import { IMainResponseWithStream } from '../../common/type/exportFileStream.type';
import { DB } from '../../common/type/kysely/db.type';
import { selectAllForExport } from '../soundType/soundType.repository';
import { IExportSoundTypeFilesSchema } from './schemas/exportSoundTypeFiles.schema';

export async function exportSoundType(db: Kysely<DB>, request: IExportSoundTypeFilesSchema): Promise<IMainResponseWithStream> {
  const zip = new JSZip();
  const audioFolder = zip.folder('files');
  const csvHeader = ['id', 'name', 'underId', 'isInbuilt', 'tagName', 'comment', 'filePath'];
  const csvData: string[][] = [];

  if (request?.comment !== undefined) {
    zip.file('comment.txt', request.comment);
  }

  const filters: ExpressionWrapper<DB, 'soundType', SqlBool>[] = [];

  await pushDateTimeClause(filters, 'soundType', 'soundType.createdAt', request?.periodFrom, request?.periodTo);

  const soundTypeArr = await selectAllForExport(db, filters);

  for (const soundType of soundTypeArr) {
    const fullFilePath = filesDirPath + soundType.filePath;
    if (!existsSync(fullFilePath)) {
      return {
        statusCode: HttpStatusCode.NOT_FOUND,
        validationError: [{ property: 'filePath', type: ValidationErrorType.NOT_FOUND, message: 'file not found' }],
      };
    }

    const buffer = readFileSync(fullFilePath);

    audioFolder?.file(soundType.filePath, buffer);

    csvData.push([
      soundType.id,
      soundType.name,
      soundType.underId ?? '',
      String(soundType.isInbuilt),
      soundType.tag.name,
      soundType.comment ?? '',
      soundType.filePath,
    ]);
  }

  const csvString = stringify(csvData, { delimiter: '\t', header: true, columns: csvHeader, encoding: 'utf8', defaultEncoding: 'utf8' });

  zip.file('soundTypes.csv', csvString);

  const buffer = await zip.generateAsync({ type: 'nodebuffer' });

  const stream = await getFileStreamFromBuffer(buffer);

  return {
    statusCode: HttpStatusCode.OK,
    data: {
      stream,
    },
  };
}
