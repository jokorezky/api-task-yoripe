import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './middleware/jwt-auth.guard';
import { AuthMiddleware } from './middleware/auth.middleware';
import { BoardssModule } from './boards/boards.module';
import { TasksModule } from './tasks/tasks.module';
import { ProductsModule } from './products/products.module';
import { CategoryModule } from './categories/category.module';
import { BrandsModule } from './brands/brands.module';
import { RolesGuard } from "./middleware/role.guard"

@Module({
  imports: [
    JwtModule.register({}),
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    AuthModule,
    BoardssModule,
    TasksModule,
    ProductsModule,
    CategoryModule,
    BrandsModule
  ],
  // providers: [JwtAuthGuard],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthMiddleware,
    },
  ],
})
// export class AppModule { }
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(AuthMiddleware).forRoutes('*');
  }
}