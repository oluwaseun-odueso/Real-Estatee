import passport from "passport"

const GoogleStrategy = require('passport-google-oauth2').Strategy

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID!,
    clientSecret: process.env.CLIENT_SECRET!,
    callbackURL: process.env.CALLBACK_URL!,
    passReqToCallback: true
}, async function (request: any, accesToken: string, refreshToken: string, profile: any, done: (arg0: null, arg1: any) => any) {
    console.log(profile)
    return done(null, profile)
}))