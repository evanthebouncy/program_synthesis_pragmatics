import numpy as np
import random
from matplotlib import pyplot as plt
from matplotlib.patches import Circle
from matplotlib.patches import Rectangle

# ========================== CONSTANTS ============================
L = 7
SHAPES = ['CUBE', 'SPHERE', 'EMPTY']
COLORS = ['R', 'G', 'B']

def get_shape_pattern(i_start, i_end, j_start, j_end):
    shape1 = random.choice([0,1])
    shape2 = random.choice([0,1,2])
    thickness = random.choice([1,2,3])
    def shape1_pred(i,j):
        is_wall = [
                    (i - i_start) < thickness,
                    (j - j_start) < thickness,
                    (i_end - i) < thickness,
                    (j_end - j) < thickness,
                  ]
        return any(is_wall)

    def pattern(i,j):
        if shape1_pred(i,j):
            return shape1
        else:
            return shape2

    return pattern

def get_color_pattern(i_start, i_end, j_start, j_end):
    pattfs = [lambda x : 0,
                lambda x : 1,
                lambda x : 2,
                lambda x : 0 if x % 2 else 1,
                lambda x : 1 if x % 2 else 2,
                lambda x : 2 if x % 2 else 0,
                ]
    indexs = ['i', 'j', 'i+j']
    pattfunc = random.choice(pattfs)
    patt_id = random.choice(indexs)

    def pattern(i,j):
        return pattfunc(eval(patt_id))
    return pattern

# renders the program into a dictionary of (i,j) => (shape, color)
def render_shapes():
    def gen_range():
        start = random.choice([_ for _ in range(L)])
        end = random.choice([_ for _ in range(L)])
        if start + 2 <= end:
            return (start, end)
        else:
            return gen_range()
    i_start, i_end = gen_range()
    j_start, j_end = gen_range()

    shape_fun = get_shape_pattern(i_start, i_end, j_start, j_end)
    color_fun = get_color_pattern(i_start, i_end, j_start, j_end)

    ret = dict()
    for i in range(i_start, i_end+1):
        for j in range(j_start, j_end+1):
            shape = SHAPES[shape_fun(i,j)]
            color = COLORS[color_fun(i,j)]
            if shape != 'EMPTY':
                ret[(i,j)] = (shape, color)
    return ret

# draws the shapes onto a canvas
def draw(shapes, name):
    R = 0.9 / 2 / L
    plt.figure()
    currentAxis = plt.gca(aspect='equal')

    for coord in shapes:
        shape, color = shapes[coord]
        x,y = coord
        if shape == 'CUBE':
            currentAxis.add_patch(Rectangle((x/L, y/L), 2*R,2*R, facecolor=color))
        if shape == 'SPHERE':
            currentAxis.add_patch(Circle((x/L+R, y/L+R), R, facecolor=color))
    plt.savefig(f'drawings/{name}.png')
    plt.close()


# generate a legal program, where legality is defined loosely
def gen_legal_shape():
    shapes = render_shapes()
    if len(shapes) >= 1:
        return shapes
    else:
        return gen_legal_shape()

# turn shape into a cononical repr so to keep duplicate programs out
def shape_to_repr(shapes):
    return tuple(sorted(list(shapes.items())))
def unrepr_shape(shape_repr):
    return dict(shape_repr)

if __name__ == '__main__':
    shapes = gen_legal_shape()
    # print (shapes)
    # print (shape_to_repr(shapes))
    draw(shapes, 'prog')
