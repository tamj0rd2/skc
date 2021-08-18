module.exports = {
  setupFilesAfterEnv: ['<rootDir>/src/extend-expect.ts'],
  moduleNameMapper: {
    // eslint-disable-next-line prettier/prettier
    '~testing\/(.*)$': '<rootDir>/../../testing/$1',
    '~(.*)$': '<rootDir>/src/$1',
    '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$': 'identity-obj-proxy'
  },
}
