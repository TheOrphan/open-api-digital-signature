import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const options = (moduleName: string) =>
  new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`SF Digital Signature - ${moduleName}`)
    .setDescription('API description for Digital Signature')
    .setVersion('0.1')
    .addTag(moduleName)
    .build();

const docSwagger = (app, moduleName: string, module) =>
  SwaggerModule.createDocument(app, options(moduleName), {
    include: [module],
  });

export const swagger = (route: string, app: any, name: string, module: any) =>
  SwaggerModule.setup(route, app, docSwagger(app, name, module));
