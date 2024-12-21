
declare module '@ioc:App/Firebase' {
    import FirebaseService from 'App/Services/Firebase';
    const Firebase: typeof FirebaseService;
    export default Firebase;
}
