a = [2, 0, 1, 4, 5]
c = sorted(a)

for i in range(len(c)):
    if c[i] != i:
        print("Missing number:", i)
        break