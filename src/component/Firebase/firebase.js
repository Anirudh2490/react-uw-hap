import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_MESSAGING_APP_ID
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.emailAuthProvider = app.auth.EmailAuthProvider;
    this.recaptcha = app.auth;
    this.auth = app.auth();
    this.fsdb = app.firestore();
  }

  doCheckExistenceWithEmail = email =>
    this.auth.fetchSignInMethodsForEmail(email);

  doSignInWithCustomToken = token => this.auth.signInWithCustomToken(token);

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  doCreateUserWithPhone = (number, captcha) =>
    this.auth.signInWithPhoneNumber(number, captcha);

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.users(authUser.uid)
          .get()
          .then(doc => {
            if (doc.data() !== undefined) {
              authUser = {
                uid: authUser.uid,
                email: authUser.email,
                emailVerified: authUser.emailVerified,
                providerData: authUser.providerData,
                userrole: doc.data().userrole
              };
            }
            next(authUser);
          });
      } else {
        if (authUser) {
          fallback(authUser);
        } else {
          fallback();
        }
      }
    });

  // *** Merge Auth and DB User API *** //
  customerListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.customers(window.localStorage.dbDocID)
          .get()
          .then(doc => {
            var dbUser = doc.data().customerDetails.userrole;

            // default empty roles
            if (!dbUser) {
              dbUser = false;
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              emailVerified: authUser.emailVerified,
              providerData: authUser.providerData,
              userrole: dbUser
            };
            next(authUser);
          });
      } else {
        if (authUser) {
          fallback(authUser);
        } else {
          fallback();
        }
      }
    });

  user = uid => this.fsdb.doc(`userCollection/${uid}`);
  customers = uid => this.fsdb.collection("form-inquiry").doc(uid);

  users = uid => this.fsdb.collection("userCollection").doc(uid);
}

export default Firebase;
