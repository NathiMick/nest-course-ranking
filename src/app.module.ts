import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';
import { ChallengesModule } from './challenges/challenges.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    // MongooseModule.forRoot(
    //   `mongodbURI`,
    //   {
    //     useNewUrlParser: true,
    //     // useCreateIndex: true,
    //     useUnifiedTopology: true,
    //     // useFindAndModify: false,
    //   },
    // ),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB_URI'),
      }),
    }),
    ConfigModule.forRoot(),
    PlayersModule,
    CategoriesModule,
    ChallengesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
