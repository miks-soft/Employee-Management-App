import fs from 'fs';
import openapiTS from 'openapi-typescript';

const GENERATED_TYPES_PATH = './generated/';
const GENERATED_TYPES_NAME = 'api.ts';

const fetchTypes = async () => {
  const schema = await fs.promises.readFile('./generated/api-raw.json', 'utf8');

  const types = await openapiTS(JSON.parse(schema));

  fs.writeFileSync(`${GENERATED_TYPES_PATH}${GENERATED_TYPES_NAME}`, types);
};

fetchTypes();
