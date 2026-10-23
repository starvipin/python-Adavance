arr = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

current_sum = 0
max_sum = float('-inf')
print(max_sum)

start = 0
best_start = 0
best_end = 0

for i in range(len(arr)):
    if current_sum <= 0:
        current_sum = arr[i]
        start = i
    else:
        current_sum += arr[i]

    if current_sum > max_sum:
        max_sum = current_sum
        best_start = start
        best_end = i

print(arr[best_start:best_end + 1])
print(max_sum)