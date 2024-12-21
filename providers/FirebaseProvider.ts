import { ApplicationContract } from '@ioc:Adonis/Core/Application';
import FirebaseService from 'App/Services/Firebase';

export default class FirebaseProvider {
    constructor(protected app: ApplicationContract) {}

    public register() {
        this.app.container.singleton('App/Firebase', () => {
            FirebaseService.initialize();
            return FirebaseService;
        });
    }

    public boot() {
        // Optionally perform actions after the provider has been registered
    }

    public shutdown() {
        // Cleanup resources when the app is shutting down
    }

    public async ready() {
        // Perform actions when the app is ready
    }
}
