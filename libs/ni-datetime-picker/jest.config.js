module.exports = {
  name: 'ni-datetime-picker',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ni-datetime-picker',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
