import json
import csv


with open('pig1-90938-batch_5-export.json') as f:
    data5 = json.load(f)

with open('pig1-90938-batch_4-export.json') as f:
    data4 = json.load(f)

data4.update(data5)
data = data4

def make_exclude_user(data):

    to_exclude = set()
    # what is this code lol
    data_batch = data
    for subject_id in data_batch:
        try: 
            if len(data_batch[subject_id]['quiz']['quiz_answers']) > 2:
                print ("quiz failed")
                to_exclude.add(subject_id)
        except:
            print ("no quiz found")
            to_exclude.add(subject_id)
        try:
            responses = data_batch[subject_id]['data']
        except:
            print (f"incomplete entry without data field on {subject_id}")
            to_exclude.add(subject_id)
            continue
        for res in responses.values():
            if res['examples_used'] >= 20:
                print (f"suspected user {subject_id} not understanding the problem statement, they used {res['examples_used']}")
                to_exclude.add(subject_id)
    
    return to_exclude

def make_responses(data):
    n_subjects = 0

    to_exclude = make_exclude_user(data)
    print (f"these users are excluded {to_exclude}")

    rows = []
    first_row = ['subject', 'robot', 'target_id', 'moves']
    rows.append(first_row)
    data_batch = data
    n_subjects = 0
    for subject_id in data_batch:
        if subject_id in to_exclude:
            continue
        n_subjects += 1
        responses = data_batch[subject_id]['data']
        for res in responses.values():
            robot = "white" if res['robot_id'] == 0 else "blue"
            example_sequence = [x[:3] for x in res['all_examples']]
            rows.append([subject_id, robot, res['target_id'], example_sequence])
    
    print (f"parsed csv info for n = {n_subjects} subjects")
    return rows

def write_csv(file_loc, rows):
    with open(file_loc, 'w', newline='') as file:
        writer = csv.writer(file)
        for row in rows:
            writer.writerow(row)
        # writer.writerow(["SN", "Name", "Contribution"])
        # writer.writerow([1, "Linus Torvalds", "Linux Kernel"])
        # writer.writerow([2, "Tim Berners-Lee", "World Wide Web"])

if __name__ == '__main__':
    write_csv('responses.csv', make_responses(data))