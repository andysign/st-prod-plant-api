"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.setGlobalPrefix("/api/v0", { exclude: ["/", "/health"] });
    const document = swagger_1.SwaggerModule.createDocument(app, new swagger_1.DocumentBuilder()
        .setTitle("API")
        .setDescription("The Production Backend API (by Andy B)")
        .setVersion("1.0")
        .addTag("App")
        .build());
    const documentFactory = () => swagger_1.SwaggerModule.createDocument(app, document);
    const SwaggerCustomOpt = { jsonDocumentUrl: "json", yamlDocumentUrl: "yaml" };
    swagger_1.SwaggerModule.setup("/api/v0", app, documentFactory, SwaggerCustomOpt);
    await app.listen(3000);
}
bootstrap();
//# sourceMappingURL=main.js.map