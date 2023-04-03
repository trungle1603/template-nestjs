import { resolveMx } from 'dns/promises';

export async function isEmailDomain(email: string): Promise<boolean> {
    if (email) {
        // Extract domain from email address
        const domain = email.split('@')[1];

        // Use DNS to check if domain exists
        const addresses = await resolveMx(domain);
        if (!addresses || addresses.length === 0) {
            return false;
        }
        return true;
    }
    return false;
}
