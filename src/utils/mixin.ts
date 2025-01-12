import _ from 'lodash';

_.mixin({
  isVoid(value: any) {
    return value === undefined || value === null || value === '';
  },
});
