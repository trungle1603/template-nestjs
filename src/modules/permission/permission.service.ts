import { SUCCESSFUL_MSG } from '@common/constants/success-msg.constant';
import { IS_PUBLIC_KEY } from '@common/decorators/public.decorator';
import { Injectable } from '@nestjs/common';
import glob from 'glob';
import * as fs from 'node:fs/promises';
import path from 'path';
import 'reflect-metadata';

@Injectable()
export class PermissionService {
    async generateListPermission() {
        const file = path.join(
            process.cwd(),
            'src/permission/permission.constant.ts',
        );

        const [oldContent, requirePermissions, publicPermissions] =
            await Promise.all([
                fs.readFile(file, 'utf8'),
                this.getAllResolverMethodNames(false),
                this.getAllResolverMethodNames(true),
            ]);

        const arrContent = oldContent.split(';');
        const performOldContent = arrContent
            .filter(
                (item) =>
                    !item.includes('REQUIRE_PERMISSION') &&
                    !item.includes('PUBLIC_PERMISSION'),
            )
            .join('\n');

        const newContent =
            performOldContent +
            `export const REQUIRE_PERMISSION = [ ${requirePermissions.map(
                (permission) => `'${permission}'`,
            )}];\n` +
            `\nexport const PUBLIC_PERMISSION = [ ${publicPermissions.map(
                (permission) => `'${permission}'`,
            )}];`;
        await fs.writeFile(file, newContent);
        return SUCCESSFUL_MSG;
    }

    /**
     *
     * @param publicDecorator If true, return all method names has Public decorator
     * @returns
     */
    async getAllResolverMethodNames(publicDecorator?: boolean) {
        const methodNames = [];
        // Read all resolver files
        const resolverFiles = glob.sync(
            path.join(process.cwd(), 'dist/**/*.resolver.js'),
        );

        for (let i = 0, length = resolverFiles.length; i < length; i++) {
            const file = resolverFiles[i];
            const classResolver = await import(file);
            const fileName = path.basename(file);
            const className = this.getClassNameFromFileName(fileName);

            const MyClass = classResolver[`${className}`];

            const arrayMethodName = this.getAllMethodNameInClass(
                MyClass,
                publicDecorator,
            );
            methodNames.push(arrayMethodName);
        }
        return methodNames.flat();
    }

    private getAllMethodNameInClass(
        myClass: any,
        publicDecorator?: boolean,
    ): string[] {
        return Object.getOwnPropertyNames(myClass.prototype).filter((name) => {
            const method = myClass.prototype[name];

            if (publicDecorator === true) {
                return (
                    typeof method === 'function' &&
                    name !== 'constructor' &&
                    Reflect.getMetadata(IS_PUBLIC_KEY, method)
                );
            } else if (publicDecorator === false) {
                return (
                    typeof method === 'function' &&
                    name !== 'constructor' &&
                    !Reflect.getMetadata(IS_PUBLIC_KEY, method)
                );
            }
            return typeof method === 'function' && name !== 'constructor';
        });
    }

    /**
     * @example auth.resolver.js
     * @returns AuthResolver
     */
    private getClassNameFromFileName(fileName: string) {
        const arraySplit = fileName.split('.');
        const className =
            this.capitalizeFirstLetter(arraySplit[0]) +
            this.capitalizeFirstLetter(arraySplit[1]);
        return className;
    }

    private capitalizeFirstLetter(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
