import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// export const SAMPLE_METADATA_KEY = 'sample';

// export const SampleDecorator = (): any => {
//   return (target, propertyKey, descriptor) => {
//     const sampleService = Inject(SampleService);
//     const sample = sampleService.someMethod(); // Use any method of SampleService here

//     SetMetadata(SAMPLE_METADATA_KEY, sample)(target, propertyKey, descriptor);
//   };
// };
