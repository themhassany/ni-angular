module.exports = {
  name: 'ni-datetime-pipe',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/ni-datetime-pipe',
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer.js',
    'jest-preset-angular/build/HTMLCommentSerializer.js'
  ]
};
