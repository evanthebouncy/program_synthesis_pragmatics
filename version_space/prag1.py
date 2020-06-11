from grid import *
import tqdm
import pickle
import numpy as np

ALL_SHAPE_REPRS, L0VS = pickle.load(open("L0VS.p" ,"rb"))

# the literal listener upon hearing utterances
def L0(us):
    ret = set.intersection(*[L0VS[u] for u in us])
    pr = np.ones(len(ret))
    return ret, pr / np.sum(pr) 

# the literal speaker that utters all it can sans whats already being said
def S0(shape_repr_id, us=[]):
    shapes = unrepr_shape(ALL_SHAPE_REPRS[shape_repr_id])
    utters = []
    for i in range(L):
        for j in range(L):
            to_append = ((i, j), shapes[(i,j)] if (i,j) in shapes else 'EMPTY')
            if to_append not in us:
                utters.append(to_append)
    return utters

# get 1step S1 probability, PS1_1(u | w us)
# return a list of further uttrances and PS1_1(u | w us) normalised
def PS1_1(shape_repr_id, us):
    u_news = S0(shape_repr_id, us)
    vs_us = L0(us)[0] if len(us) > 0 else set()

    u_weights = []
    for u_new in u_news:
        vs_us_new = set.intersection(vs_us, L0([u_new])[0]) if len(vs_us) > 0 else L0([u_new])[0]
        u_weights.append(1 / len(vs_us_new))
    u_weights = np.array(u_weights)
    return u_news, u_weights / np.sum(u_weights)

# get a logPS1 score for a particular us upon shape_repr_id
def logPS1(shape_repr_id, us):
    logpr = 0.0
    for i in range(len(us)):
        to_utter = us[i]
        utters, utter_prob = PS1_1(shape_repr_id, us[:i]) 
        prob_idx = utters.index(to_utter)
        logpr += np.log(utter_prob[prob_idx])
    return logpr

# get PL1 from utterances us
def PL1(us):
    shape_repr_ids = list(L0(us)[0])
    shape_repr_id_weights = []
    for i, p in tqdm.tqdm(enumerate(shape_repr_ids)):
        shape_repr_id_weights.append(logPS1(p, us))
    return shape_repr_ids, shape_repr_id_weights

def interactive(listener, goal_shape_reprs):
    draw(unrepr_shape(goal_shape_reprs), 'target')
    us = []
    while True:
        raw = input("i[0-6] j[0-6] SHAPE[SPHERE CUBE EMPTY] COLOR[R G B] \n>>>").split(' ')
        # UNDO UNDO LMAO
        if raw[0] == 'UNDO':
            us = us[:-1]
            if len(us) == 0:
                continue
        else:
            coords = int(raw[0]), int(raw[1])
            shape = raw[2]
            if shape == 'EMPTY':
                us.append((coords, 'EMPTY'))
            else:
                us.append((coords, (shape, raw[3])))

        shape_repr_ids, idd_weights = listener(us)
        print (f"{len(shape_repr_ids)} candidates remain")
        shape_reprs = list(shape_repr_ids)
        idx_weights = list(reversed(sorted(list(zip(idd_weights, range(len(idd_weights)))))))
        print (f"top3 {idx_weights[:3]}")
        top3 = [x[1] for x in idx_weights[:3]]
        for j, i in enumerate(top3):
            draw(unrepr_shape(ALL_SHAPE_REPRS[shape_reprs[i]]), f"candidate_{j}")


if __name__ == '__main__':
    #_, shapes = gen_legal_prog_shape()
    #print (shapes)
    shaperepr = random.choice(ALL_SHAPE_REPRS)
    interactive(PL1, shaperepr)
    #interactive(L0, shaperepr)
    
