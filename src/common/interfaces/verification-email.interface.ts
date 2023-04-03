export interface VerificationEmailInterface {
    to: string;
    subject: string;
    link: string;
    token: string;
}
// const link = `https://${this.appConfig.url}/${AUTH_ROUTE}/${VERIFY_EMAIL_ROUTE}?token=${token}`;
