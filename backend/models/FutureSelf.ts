import mongoose, { Schema, Document } from "mongoose";

export interface IFutureLetter {
  dayIndex: number;
  message: string;
  category: "Future Stories" | "Future Confessions" | "Future Secrets" | "Health Reflection";
  isRevealed: boolean;
  notifiedAt: Date;
  notificationText: string;
  createdAt: Date;
}

export interface IFutureSelf extends Document {
  userId: string;
  isOnboarded: boolean;
  onboardingAnswers: {
    favoriteColor?: string;
    favoriteMovieGenre?: string;
    favoriteMovie?: string;
    favoriteBook?: string;
    favoriteSport?: string;
    favoriteMusicGenre?: string;
    favoriteSong?: string;
    favoriteFood?: string;
    dreamJob?: string;
    dreamCompany?: string;
    biggestDream?: string;
    biggestFear?: string;
    bestFriendName?: string;
    roleModelHero?: string;
    favoritePlace?: string;
    countryToVisit?: string;
    thingToImprove?: string;
    habitToBuild?: string;
    habitToBreak?: string;
    skillToLearn?: string;
    whatMakesHappy?: string;
    whatMakesStressed?: string;
    biggestGoalThisYear?: string;
    thankFutureSelf?: string;
    secretNobodyKnows?: string;
    personWantToBecome?: string;
    optionalNote?: string;
    firstName?: string;
    biggestGoal?: string;
    dreamLife?: string;
    thingToChange?: string;
    thingProudOf?: string;
    favoriteHobby?: string;
  };
  letters: IFutureLetter[];
  createdAt: Date;
  updatedAt: Date;
}

const FutureSelfSchema = new Schema(
  {
    userId: { type: String, required: true, unique: true },
    isOnboarded: { type: Boolean, default: false },
    onboardingAnswers: {
      favoriteColor: { type: String, default: "" },
      favoriteMovieGenre: { type: String, default: "" },
      favoriteMovie: { type: String, default: "" },
      favoriteBook: { type: String, default: "" },
      favoriteSport: { type: String, default: "" },
      favoriteMusicGenre: { type: String, default: "" },
      favoriteSong: { type: String, default: "" },
      favoriteFood: { type: String, default: "" },
      dreamJob: { type: String, default: "" },
      dreamCompany: { type: String, default: "" },
      biggestDream: { type: String, default: "" },
      biggestFear: { type: String, default: "" },
      bestFriendName: { type: String, default: "" },
      roleModelHero: { type: String, default: "" },
      favoritePlace: { type: String, default: "" },
      countryToVisit: { type: String, default: "" },
      thingToImprove: { type: String, default: "" },
      habitToBuild: { type: String, default: "" },
      habitToBreak: { type: String, default: "" },
      skillToLearn: { type: String, default: "" },
      whatMakesHappy: { type: String, default: "" },
      whatMakesStressed: { type: String, default: "" },
      biggestGoalThisYear: { type: String, default: "" },
      thankFutureSelf: { type: String, default: "" },
      secretNobodyKnows: { type: String, default: "" },
      personWantToBecome: { type: String, default: "" },
      optionalNote: { type: String, default: "" },
      firstName: { type: String, default: "" },
      biggestGoal: { type: String, default: "" },
      dreamLife: { type: String, default: "" },
      thingToChange: { type: String, default: "" },
      thingProudOf: { type: String, default: "" },
      favoriteHobby: { type: String, default: "" }
    },
    letters: [
      {
        dayIndex: { type: Number, required: true },
        message: { type: String, required: true },
        category: { type: String, required: true },
        isRevealed: { type: Boolean, default: false },
        notifiedAt: { type: Date, default: Date.now },
        notificationText: { type: String, default: "" },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.FutureSelf || mongoose.model<IFutureSelf>("FutureSelf", FutureSelfSchema);
