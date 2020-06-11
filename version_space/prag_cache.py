from grid import L, gen_legal_shape, render_shapes, shape_to_repr
import pickle
import random

def get_version_space():
    # version space
    vs = dict()
    seen_shapes = set()
    cached_shapes = []
    len_shapes = []
    for i in range(100000000):
        shapes = gen_legal_shape()
        shape_repr = shape_to_repr(shapes)
        if shape_repr not in seen_shapes:
            seen_shapes.add(shape_repr)
            cached_shapes.append(shape_repr)
            for i in range(L):
                for j in range(L):
                    key = ((i,j), 'EMPTY' if (i,j) not in shapes else shapes[(i,j)])
                    if key not in vs:
                        vs[key] = set()
                    vs[key].add(len(cached_shapes)-1)
        if i % 1000 == 0:
            print (len(cached_shapes), sum([len(v) for v in vs.values()]))
            pickle.dump((cached_shapes, vs), open('L0VS.p', 'wb'))
            print ('dumped pickle')
            len_shapes.append(len(seen_shapes))

            # verify correctness
            random_shape_id = random.choice([_ for _ in range(len(cached_shapes))])
            random_shape = cached_shapes[random_shape_id]
            random_utter = random.choice(random_shape)
            assert random_shape_id in vs[random_utter]

            if len(len_shapes) > 200 and len_shapes[-1] == len_shapes[-100]:
                print ('were done here')
                return

if __name__ == '__main__':
    print ("uncomment this line to get new VSL0")
    get_version_space()
