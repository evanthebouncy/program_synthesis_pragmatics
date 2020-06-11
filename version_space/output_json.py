from grid import SHAPES, COLORS
import json
import pickle
from functools import singledispatch

@singledispatch
def keys_to_strings(ob):
    return ob

@keys_to_strings.register(dict)
def _handle_dict(ob):
    def change_key(k):
        return str((k[0], 2 if k[1] == 'EMPTY' else\
                (SHAPES.index(k[1][0]), COLORS.index(k[1][1]))))
    return {change_key(k): keys_to_strings(v) for k, v in ob.items()}

@keys_to_strings.register(list)
def _handle_list(ob):
    return [keys_to_strings(v) for v in ob]

@keys_to_strings.register(set)
def _handle_set(ob):
    return [keys_to_strings(v) for v in ob]

@singledispatch
def ll_to_strings(ob):
    return ob

@ll_to_strings.register(list)
def _handle_list(ob):
    return [ll_to_strings(v) for v in ob]
@ll_to_strings.register(tuple)
def _handle_tuple(ob):
    return [ll_to_strings(v) for v in ob]
@ll_to_strings.register(str)
def _handle_str(ob):
    if ob in SHAPES:
        return SHAPES.index(ob)
    if ob in COLORS:
        return COLORS.index(ob)

ALL_SHAPE_REPRS, L0VS = pickle.load(open("L0VS.p" ,"rb"))

to_dump = keys_to_strings(L0VS)
jstr = json.dumps(to_dump)
jstr = 'var l0vs = ' + jstr

to_dump_allrepr = ll_to_strings(ALL_SHAPE_REPRS)
reprjstr = json.dumps(to_dump_allrepr)
reprjstr = 'var all_shapes = ' + reprjstr

print (jstr[:100])
print (reprjstr[:100])

with open("l0vs.js", "w") as fp:
    fp.write(jstr)
with open("all_shapes.js", "w") as fp:
    fp.write(reprjstr)



