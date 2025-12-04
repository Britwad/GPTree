module.exports = {
    preset: 'ts-jest',
    testMatch: ['**/test/**/*.test.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1'
    },
    transform: {
        '^.+\\.(ts|tsx|js|jsx|mjs)$': ['ts-jest', {
            tsconfig: {
                esModuleInterop: true,
                allowSyntheticDefaultImports: true,
                allowJs: true,
            },
            useESM: true,
        }]
    },
    transformIgnorePatterns: [
        'node_modules/(?!(@auth/prisma-adapter|@auth/core|next-auth)/)'
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    extensionsToTreatAsEsm: ['.ts'],
    setupFiles: ['<rootDir>/test/setup.ts']
}