
class BaseClass(object):

    def _setProperty(self, args, field):
        if self._existField(args, field):
            setattr(self, field, args[field])

    def _existField(self, args, field):
        return isinstance(args, dict) and field in args.keys() and args[field] != ""

    def _initialize(self):
        pass
