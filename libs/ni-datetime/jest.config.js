module.exports = {
  name: 'ni-datetime',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ni-datetime',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
