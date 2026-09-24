(() => {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  const node = (id, value, next = null, state = 'normal') => ({ id, value, next, state });
  const chain = (values) => values.map((value, index) => node(
    `n${value}`,
    value,
    index < values.length - 1 ? `n${values[index + 1]}` : null
  ));
  const step = (line, name, explanation, nodes, pointers = {}, output = '', tone = 'normal') => ({
    line, name, explanation, nodes, pointers, output, tone
  });

  const operations = [
    {
      id: 'story',
      label: 'Full program',
      index: '01',
      purpose: 'Result of all function calls',
      title: 'The complete story of your program',
      complexity: 'Sequence',
      code: [
        'obj = SinglyLinkedList()',
        'obj.insertAtEnd(10)',
        'obj.insertAtEnd(20)',
        'obj.insertAtEnd(30)',
        'obj.insertAtBegin(5)',
        'obj.insertAtMiddle(40, 20)',
        'obj.deleteLinkList(30)',
        'obj.printLinkedList()'
      ],
      steps: [
        step(1, 'An empty list is created', 'The list object is created and head becomes None. The list does not contain any nodes yet.', [], { head: null }),
        step(2, '10 is appended', 'The list was empty, so the new Node(10) directly becomes the head.', chain([10]), { head: 'n10' }),
        step(3, '20 is appended', 'current reaches the final node, 10, and connects 10.next to Node(20).', chain([10, 20]), { head: 'n10' }),
        step(4, '30 is appended', 'current passes nodes 10 and 20. Then 20.next is connected to Node(30).', chain([10, 20, 30]), { head: 'n10' }),
        step(5, '5 is inserted at the beginning', 'First, 5.next points to the old head, 10. Then head is redirected to Node(5).', chain([5, 10, 20, 30]), { head: 'n5' }),
        step(6, '40 is inserted after 20', 'The old next reference of 20 was 30. Node 40 is placed between them to create 20 → 40 → 30.', chain([5, 10, 20, 40, 30]), { head: 'n5' }),
        step(7, '30 is deleted', '30 was the final node, so the previous node, 40, is changed to next = None.', [...chain([5, 10, 20, 40]), node('n30', 30, null, 'removed')], { head: 'n5', prev: 'n40' }),
        step(8, 'The list is printed', 'current travels from head to the final node and prints each data value in order.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n40' }, '5 10 20 40')
      ]
    },
    {
      id: 'node',
      label: 'Node',
      index: '02',
      purpose: 'Create one node in memory',
      title: 'How Node.__init__ works',
      complexity: 'O(1)',
      code: [
        'class Node:',
        '    def __init__(self, info, next=None):',
        '        self.data = info',
        '        self.next = next'
      ],
      steps: [
        step(1, 'The Node blueprint is defined', 'The Node class says that every node has two parts named data and next.', [], {}),
        step(2, 'Memory is allocated for Node(10)', 'self refers to the new node, info receives 10, and next has the default value None.', [node('n10', '?', null, 'detached')], { self: 'n10' }),
        step(3, '10 is stored in data', 'self.data = info stores 10 in the data part of the new node.', [node('n10', 10, null, 'detached')], { self: 'n10' }),
        step(4, 'None is stored in next', 'self.next = next means that this node is not connected to another node yet.', [node('n10', 10, null, 'detached')], { self: 'n10' })
      ]
    },
    {
      id: 'list',
      label: 'List init',
      index: '03',
      purpose: 'Create the entry point of the list',
      title: 'SinglyLinkedList.__init__',
      complexity: 'O(1)',
      code: [
        'class SinglyLinkedList:',
        '    def __init__(self, head=None):',
        '        self.head = head'
      ],
      steps: [
        step(2, 'The list object is created', 'The head parameter defaults to None because there is no first node initially.', [], { head: null }),
        step(3, 'self.head is set', 'self.head will store a reference to the first node. Right now, None means the list is empty.', [], { head: null })
      ]
    },
    {
      id: 'end',
      label: 'End insert',
      index: '04',
      purpose: 'Add a new node at the end',
      title: 'insertAtEnd(value)',
      complexity: 'O(n)',
      code: [
        'def insertAtEnd(self, value):',
        '    temp = Node(value)',
        '',
        '    if self.head is None:',
        '        self.head = temp',
        '        return',
        '',
        '    current = self.head',
        '    while current.next is not None:',
        '        current = current.next',
        '    current.next = temp'
      ],
      steps: [
        step(2, 'First call: temp = Node(10)', 'A new Node(10) is created. temp stores a reference to that new node.', [node('n10', 10, null, 'detached')], { head: null, temp: 'n10' }),
        step(4, 'Is the list empty?', 'Yes. self.head is None, so the short empty-list branch runs.', [node('n10', 10, null, 'detached')], { head: null, temp: 'n10' }),
        step(5, 'Make Node(10) the head', 'self.head = temp makes Node(10) both the first and final node.', chain([10]), { head: 'n10', temp: 'n10' }),
        step(6, 'Return immediately', 'The empty-list case is complete, so return stops the function here.', chain([10]), { head: 'n10' }),
        step(2, 'Second call: create Node(20)', 'Node(20) is detached for a moment. It must be connected to the end of the list.', [...chain([10]), node('n20', 20, null, 'detached')], { head: 'n10', temp: 'n20' }),
        step(8, 'current = self.head', 'The list is not empty, so current starts at the first node, 10.', [...chain([10]), node('n20', 20, null, 'detached')], { head: 'n10', current: 'n10', temp: 'n20' }),
        step(9, 'Check current.next', '10.next is None, so Node(10) is already the final node and the loop does not run.', [...chain([10]), node('n20', 20, null, 'detached')], { head: 'n10', current: 'n10', temp: 'n20' }),
        step(11, 'Connect 10 to 20', 'current.next = temp connects Node(10) to Node(20).', chain([10, 20]), { head: 'n10', current: 'n10', temp: 'n20' }),
        step(2, 'Third call: create Node(30)', 'Node(30) is created separately. This time, the loop must find the final node.', [...chain([10, 20]), node('n30', 30, null, 'detached')], { head: 'n10', temp: 'n30' }),
        step(8, 'current starts at head again', 'Every non-empty insertion search begins at head, which is Node(10).', [...chain([10, 20]), node('n30', 30, null, 'detached')], { head: 'n10', current: 'n10', temp: 'n30' }),
        step(9, 'Does current have a next node?', 'Yes. 10.next points to Node(20), so the loop body runs.', [...chain([10, 20]), node('n30', 30, null, 'detached')], { head: 'n10', current: 'n10', temp: 'n30' }),
        step(10, 'current moves forward', '10.next exists, so current = current.next moves current to Node(20).', [...chain([10, 20]), node('n30', 30, null, 'detached')], { head: 'n10', current: 'n20', temp: 'n30' }),
        step(9, 'The final node is found', '20.next is None, so the while loop stops with current on Node(20).', [...chain([10, 20]), node('n30', 30, null, 'detached')], { head: 'n10', current: 'n20', temp: 'n30' }),
        step(11, 'Connect 20 to 30', 'current.next = temp connects Node(30) at the end. The chain is now 10 → 20 → 30.', chain([10, 20, 30]), { head: 'n10', current: 'n20', temp: 'n30' })
      ]
    },
    {
      id: 'begin',
      label: 'Begin insert',
      index: '05',
      purpose: 'Add a new node at the beginning',
      title: 'insertAtBegin(value)',
      complexity: 'O(1)',
      code: [
        'def insertAtBegin(self, value):',
        '    self.head = Node(value, self.head)'
      ],
      steps: [
        step(2, 'Remember the old head', 'Before the assignment, head points to Node(10), the first node of the old list.', chain([10, 20, 30]), { head: 'n10' }),
        step(2, 'Create Node(5, self.head)', 'Node(5) is created with its next reference already pointing to the old head, Node(10).', [...chain([10, 20, 30]), node('n5', 5, 'n10', 'detached')], { head: 'n10', new: 'n5' }),
        step(2, 'Assign the new node to head', 'self.head now points to Node(5). In one line, the list becomes 5 → 10 → 20 → 30.', chain([5, 10, 20, 30]), { head: 'n5' })
      ]
    },
    {
      id: 'middle',
      label: 'Middle insert',
      index: '06',
      purpose: 'Insert after the node containing x',
      title: 'insertAtMiddle(value, x)',
      complexity: 'O(n)',
      code: [
        'def insertAtMiddle(self, value, x):',
        '    current = self.head',
        '',
        '    while current is not None:',
        '        if current.data == x:',
        '            current.next = Node(value, current.next)',
        '            return True',
        '        current = current.next',
        '',
        '    return False'
      ],
      steps: [
        step(2, 'current = self.head', 'The search begins at the first node, Node(5).', chain([5, 10, 20, 30]), { head: 'n5', current: 'n5' }),
        step(4, 'Is current a real node?', 'Yes. current is Node(5), so the while loop can safely inspect it.', chain([5, 10, 20, 30]), { head: 'n5', current: 'n5' }),
        step(5, 'Does 5 equal x?', 'No. current.data is 5, but x is 20.', chain([5, 10, 20, 30]), { head: 'n5', current: 'n5' }),
        step(8, 'Move current to Node(10)', 'current = current.next advances the search by one node.', chain([5, 10, 20, 30]), { head: 'n5', current: 'n10' }),
        step(5, 'Does 10 equal x?', 'No. The search must continue.', chain([5, 10, 20, 30]), { head: 'n5', current: 'n10' }),
        step(8, 'Move current to Node(20)', 'current advances again. Now current.data is 20, which matches x.', chain([5, 10, 20, 30]), { head: 'n5', current: 'n20' }),
        step(6, 'Create Node(40, current.next)', 'A new Node(40) is created. Its next reference immediately points to the old next node, Node(30).', [...chain([5, 10, 20, 30]), node('n40', 40, 'n30', 'detached')], { head: 'n5', current: 'n20', new: 'n40' }),
        step(6, 'Assign the new node to current.next', '20.next is redirected to Node(40). The chain becomes 20 → 40 → 30.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n20' }),
        step(7, 'Return True', 'The insertion succeeded, so return True stops the function immediately.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n20' }),
        step(10, 'If x is not found', 'When current finally becomes None, the loop ends and return False tells the caller that nothing was inserted.', chain([5, 10, 20, 30]), { head: 'n5', current: null })
      ]
    },
    {
      id: 'delete',
      label: 'Delete',
      index: '07',
      purpose: 'Remove the target node from the chain',
      title: 'deleteLinkList(value)',
      complexity: 'O(n)',
      code: [
        'def deleteLinkList(self, value):',
        '    current = self.head',
        '',
        '    if current is None:',
        '        return False',
        '',
        '    if current.data == value:',
        '        self.head = current.next',
        '        return True',
        '',
        '    prev = current',
        '    current = current.next',
        '',
        '    while current is not None:',
        '        if current.data == value:',
        '            prev.next = current.next',
        '            return True',
        '        prev = current',
        '        current = current.next',
        '',
        '    return False'
      ],
      steps: [
        step(2, 'current = self.head', 'The deletion search begins at the first node, Node(5).', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n5' }),
        step(4, 'Check for an empty list', 'current is Node(5), not None, so the function can continue safely.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n5' }),
        step(7, 'Does the head contain 30?', 'No. Node(5) is not the target, so head does not need to change.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n5' }),
        step(11, 'prev = current', 'prev starts at Node(5). It will stay one node behind current.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n5', prev: 'n5' }),
        step(12, 'Move current to Node(10)', 'current advances once, while prev remains on Node(5).', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n10', prev: 'n5' }),
        step(15, 'Does 10 match the target?', 'No. The search must move forward.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n10', prev: 'n5' }),
        step(18, 'Move prev to Node(10)', 'prev = current moves prev onto Node(10). For this moment, both pointers share the same node.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n10', prev: 'n10' }),
        step(19, 'Move current to Node(20)', 'current = current.next advances only current, putting prev one node behind again.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n20', prev: 'n10' }),
        step(15, 'Does 20 match the target?', 'No. The target value is 30, so the loop continues.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n20', prev: 'n10' }),
        step(18, 'Move prev to Node(20)', 'prev catches up to current before current advances again.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n20', prev: 'n20' }),
        step(19, 'Move current to Node(40)', 'current follows the next link to Node(40).', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n40', prev: 'n20' }),
        step(15, 'Does 40 match the target?', 'No. The search needs one more move.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n40', prev: 'n20' }),
        step(18, 'Move prev to Node(40)', 'prev catches up and now points to Node(40).', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n40', prev: 'n40' }),
        step(19, 'Move current to Node(30)', 'current follows 40.next and reaches the target node.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n30', prev: 'n40' }),
        step(15, 'Node(30) matches', 'current.data equals the value we want to delete.', chain([5, 10, 20, 40, 30]), { head: 'n5', current: 'n30', prev: 'n40' }),
        step(16, 'Skip over Node(30)', 'prev.next = current.next copies 30.next, which is None, into 40.next. Node(30) leaves the chain.', [...chain([5, 10, 20, 40]), node('n30', 30, null, 'removed')], { head: 'n5', current: 'n30', prev: 'n40' }),
        step(17, 'Return True', 'Deletion succeeded, so the function stops immediately and returns True.', [...chain([5, 10, 20, 40]), node('n30', 30, null, 'removed')], { head: 'n5', prev: 'n40' }),
        step(5, 'The empty-list case is safe', 'If head is None, return False runs before the code tries to read any node data.', [], { head: null, current: null }),
        step(8, 'Deleting the head is simple', 'If the first node matches, head moves to current.next. The old head leaves the list.', [...chain([10, 20, 40, 30]), node('n5', 5, 'n10', 'removed')], { head: 'n10', current: 'n5' }),
        step(16, 'The same rule deletes a middle node', 'To delete 20, prev.next receives current.next. Node(10) now points directly to Node(40).', [...chain([5, 10, 40, 30]), node('n20', 20, 'n40', 'removed')], { head: 'n5', current: 'n20', prev: 'n10' })
      ]
    },
    {
      id: 'print',
      label: 'Print',
      index: '08',
      purpose: 'Read the data from every node',
      title: 'printLinkedList()',
      complexity: 'O(n)',
      code: [
        'def printLinkedList(self):',
        '    current = self.head',
        '',
        '    while current is not None:',
        '        print(current.data, end=" ")',
        '        current = current.next',
        '    print()'
      ],
      steps: [
        step(2, 'current = self.head', 'Traversal starts at the first node, Node(5).', chain([5, 10, 20, 40]), { head: 'n5', current: 'n5' }),
        step(4, 'Is current a real node?', 'Yes. current is not None, so the loop body can safely read current.data.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n5' }),
        step(5, 'Print 5', 'current.data is 5. end=" " prints a space instead of moving to a new line.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n5' }, '5'),
        step(6, 'Move current to Node(10)', 'current = current.next advances traversal by one node.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n10' }, '5'),
        step(5, 'Print 10', 'current.data is now 10, so 10 is added to the output.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n10' }, '5 10'),
        step(6, 'Move to Node(20)', 'Following next moves current to Node(20).', chain([5, 10, 20, 40]), { head: 'n5', current: 'n20' }, '5 10'),
        step(5, 'Print 20', '20 is added to the output.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n20' }, '5 10 20'),
        step(6, 'Move to the final node', 'current follows next and reaches Node(40).', chain([5, 10, 20, 40]), { head: 'n5', current: 'n40' }, '5 10 20'),
        step(5, 'Print 40', 'The final node is printed inside the same loop as every other node.', chain([5, 10, 20, 40]), { head: 'n5', current: 'n40' }, '5 10 20 40'),
        step(6, 'current becomes None', '40.next is None, so current becomes None and the loop ends safely.', chain([5, 10, 20, 40]), { head: 'n5', current: null }, '5 10 20 40'),
        step(7, 'Print a final newline', 'print() finishes the output line. On an empty list, the loop simply runs zero times and this line still works.', chain([5, 10, 20, 40]), { head: 'n5' }, '5 10 20 40')
      ]
    }
  ];

  const elements = {
    tabs: document.getElementById('operationTabs'),
    panel: document.getElementById('labPanel'),
    labIndex: document.getElementById('labIndex'),
    purpose: document.getElementById('operationPurpose'),
    title: document.getElementById('operationTitle'),
    complexity: document.querySelector('#complexityBadge strong'),
    stepCount: document.getElementById('stepCount'),
    stepName: document.getElementById('stepName'),
    prev: document.getElementById('prevStep'),
    next: document.getElementById('nextStep'),
    progress: document.getElementById('stepProgress'),
    progressFill: document.getElementById('progressFill'),
    code: document.getElementById('codeView'),
    memoryCanvas: document.getElementById('memoryCanvas'),
    svg: document.getElementById('memorySvg'),
    explanationRow: document.querySelector('.explanation-row'),
    explanation: document.getElementById('stepExplanation'),
    pointers: document.getElementById('pointerState'),
    output: document.getElementById('outputState'),
    copy: document.getElementById('copyCode'),
    copyLabel: document.getElementById('copyLabel'),
    correctCode: document.getElementById('correctCode')
  };

  let operationIndex = 0;
  let stepIndex = 0;
  let lastCanvasWidth = 0;

  const svgElement = (tag, attributes = {}) => {
    const element = document.createElementNS(SVG_NS, tag);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
    return element;
  };

  const addSvgText = (parent, value, attributes = {}) => {
    const text = svgElement('text', attributes);
    text.textContent = value;
    parent.appendChild(text);
    return text;
  };

  const getCurrent = () => {
    const operation = operations[operationIndex];
    return { operation, currentStep: operation.steps[stepIndex] };
  };

  const nodeLabel = (targetId) => {
    if (targetId === null) return 'None';
    const { currentStep } = getCurrent();
    const target = currentStep.nodes.find((item) => item.id === targetId);
    return target ? `Node(${target.value})` : 'None';
  };

  const renderCode = (lines, activeLine) => {
    elements.code.replaceChildren();

    lines.forEach((source, index) => {
      const row = document.createElement('span');
      row.className = `code-line${index + 1 === activeLine ? ' is-active' : ''}`;
      if (index + 1 === activeLine) row.setAttribute('aria-current', 'step');

      const lineNumber = document.createElement('span');
      lineNumber.className = 'line-number';
      lineNumber.textContent = String(index + 1).padStart(2, '0');

      const codeText = document.createElement('span');
      codeText.textContent = source || ' ';
      row.append(lineNumber, codeText);
      elements.code.appendChild(row);
    });

    const activeRow = elements.code.querySelector('.is-active');
    if (activeRow) activeRow.scrollIntoView({ block: 'nearest' });
  };

  const pathBetween = (from, to, vertical) => {
    if (vertical) {
      const startX = from.x;
      const startY = from.y + 30;
      const endX = to.x;
      const endY = to.y - 30;
      if (Math.abs(startX - endX) < 4) return `M ${startX} ${startY} L ${endX} ${endY}`;
      return `M ${startX} ${startY} C ${startX + 72} ${startY + 12}, ${endX + 72} ${endY - 12}, ${endX} ${endY}`;
    }

    const startX = from.x + 52;
    const startY = from.y;
    const endX = to.x - 52;
    const endY = to.y;
    if (Math.abs(startY - endY) < 4 && endX > startX) return `M ${startX} ${startY} L ${endX} ${endY}`;
    const curve = from.state === 'detached' || to.state === 'detached' ? 38 : -52;
    return `M ${startX} ${startY} C ${startX + 28} ${startY + curve}, ${endX - 28} ${endY + curve}, ${endX} ${endY}`;
  };

  const renderDiagram = (currentStep) => {
    const width = Math.max(280, Math.floor(elements.memoryCanvas.getBoundingClientRect().width || 650));
    const activeNodes = currentStep.nodes.filter((item) => item.state === 'normal');
    const extraNodes = currentStep.nodes.filter((item) => item.state !== 'normal');
    const positions = new Map();
    const nodeWidth = 104;
    const nodeHeight = 60;
    const minimumHorizontalWidth = 88 + nodeWidth * activeNodes.length + 12 * Math.max(0, activeNodes.length - 1);
    const vertical = activeNodes.length > 1 ? width < minimumHorizontalWidth : width < 340;
    let height;

    if (vertical) {
      const activeCount = Math.max(activeNodes.length, activeNodes.length === 0 && extraNodes.length === 0 ? 1 : 0);
      const centerX = Math.round(width / 2);
      activeNodes.forEach((item, index) => positions.set(item.id, { x: centerX, y: 72 + index * 94, state: item.state }));
      extraNodes.forEach((item, index) => positions.set(item.id, { x: centerX, y: 72 + activeNodes.length * 94 + index * 98, state: item.state }));
      height = Math.max(300, 100 + activeCount * 94 + extraNodes.length * 98);
    } else {
      const count = Math.max(activeNodes.length, 1);
      const leftReserve = 22;
      const rightReserve = 66;
      const usable = Math.max(nodeWidth, width - leftReserve - rightReserve);
      const gap = count > 1 ? Math.min(50, Math.max(12, (usable - nodeWidth * count) / (count - 1))) : 0;
      const total = nodeWidth * count + gap * (count - 1);
      const startX = leftReserve + Math.max(0, (usable - total) / 2) + nodeWidth / 2;

      activeNodes.forEach((item, index) => positions.set(item.id, {
        x: startX + index * (nodeWidth + gap),
        y: 125,
        state: item.state
      }));

      extraNodes.forEach((item, index) => {
        const extraGap = 40;
        const groupWidth = nodeWidth * extraNodes.length + extraGap * Math.max(0, extraNodes.length - 1);
        const extraStart = Math.max(nodeWidth / 2 + 16, (width - groupWidth) / 2 + nodeWidth / 2);
        positions.set(item.id, {
          x: extraStart + index * (nodeWidth + extraGap),
          y: activeNodes.length ? 295 : 145,
          state: item.state
        });
      });
      height = activeNodes.length && extraNodes.length ? 390 : 310;
    }

    elements.svg.replaceChildren();
    elements.svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    elements.svg.setAttribute('height', String(height));
    elements.svg.style.height = `${height}px`;

    const title = svgElement('title');
    title.textContent = currentStep.name;
    const description = svgElement('desc');
    description.textContent = activeNodes.length
      ? `Linked list: ${activeNodes.map((item) => item.value).join(' to ')}`
      : 'The linked list is empty';
    elements.svg.append(title, description);

    const defs = svgElement('defs');
    const marker = svgElement('marker', {
      id: 'arrow-head', markerWidth: 8, markerHeight: 8, refX: 7, refY: 4,
      orient: 'auto', markerUnits: 'strokeWidth'
    });
    marker.appendChild(svgElement('path', { d: 'M 0 0 L 8 4 L 0 8 z', fill: 'var(--muted-2)' }));
    defs.appendChild(marker);
    elements.svg.appendChild(defs);

    if (!currentStep.nodes.length) {
      const group = svgElement('g', { class: 'svg-node' });
      const hasHeadPointer = Object.prototype.hasOwnProperty.call(currentStep.pointers || {}, 'head');
      if (hasHeadPointer) {
        addSvgText(group, 'head', {
          x: width / 2 - 52, y: 145, fill: 'var(--ink)',
          'font-family': 'var(--mono)', 'font-size': 12, 'text-anchor': 'end'
        });
        group.appendChild(svgElement('path', {
          d: `M ${width / 2 - 44} 141 L ${width / 2 - 12} 141`,
          stroke: 'var(--mint)', 'stroke-width': 2, fill: 'none', 'marker-end': 'url(#arrow-head)'
        }));
        addSvgText(group, 'None', {
          x: width / 2 + 4, y: 146, fill: 'var(--muted)',
          'font-family': 'var(--mono)', 'font-size': 12
        });
      } else {
        addSvgText(group, 'No node object has been created yet', {
          x: width / 2, y: 145, fill: 'var(--muted)',
          'font-family': 'var(--sans)', 'font-size': 12, 'text-anchor': 'middle'
        });
      }
      elements.svg.appendChild(group);
      return;
    }

    const edgeLayer = svgElement('g', { 'aria-hidden': 'true' });
    currentStep.nodes.forEach((item) => {
      if (item.state === 'removed') return;
      const from = positions.get(item.id);
      const to = item.next ? positions.get(item.next) : null;

      if (to) {
        edgeLayer.appendChild(svgElement('path', {
          class: 'svg-link', d: pathBetween(from, to, vertical),
          stroke: 'var(--muted-2)', 'stroke-width': 2, fill: 'none',
          'marker-end': 'url(#arrow-head)'
        }));
      } else {
        const path = vertical
          ? `M ${from.x} ${from.y + nodeHeight / 2} L ${from.x} ${from.y + nodeHeight / 2 + 24}`
          : `M ${from.x + nodeWidth / 2} ${from.y} L ${from.x + nodeWidth / 2 + 22} ${from.y}`;
        edgeLayer.appendChild(svgElement('path', {
          d: path, stroke: 'var(--muted-2)', 'stroke-width': 1.5, fill: 'none'
        }));
        addSvgText(edgeLayer, 'None', vertical ? {
          x: from.x, y: from.y + nodeHeight / 2 + 42,
          fill: 'var(--muted-2)', 'font-family': 'var(--mono)', 'font-size': 10,
          'text-anchor': 'middle'
        } : {
          x: from.x + nodeWidth / 2 + 27, y: from.y + 4,
          fill: 'var(--muted-2)', 'font-family': 'var(--mono)', 'font-size': 10
        });
      }
    });
    elements.svg.appendChild(edgeLayer);

    const pointerEntries = Object.entries(currentStep.pointers || {});
    currentStep.nodes.forEach((item, index) => {
      const position = positions.get(item.id);
      const group = svgElement('g', { class: 'svg-node', style: `animation-delay:${index * 28}ms` });
      const names = pointerEntries.filter(([, target]) => target === item.id).map(([name]) => name);
      const isCurrent = names.some((name) => ['current', 'prev', 'temp', 'self', 'new'].includes(name));
      const fill = item.state === 'removed'
        ? 'rgba(255, 149, 111, 0.12)'
        : item.state === 'detached'
          ? 'rgba(255, 203, 107, 0.1)'
          : isCurrent
            ? 'rgba(114, 183, 255, 0.11)'
            : 'var(--panel-2)';
      const stroke = item.state === 'removed'
        ? 'var(--orange)'
        : item.state === 'detached'
          ? 'var(--amber)'
          : names.length
            ? 'var(--blue)'
            : 'var(--line-strong)';

      if (names.length) {
        addSvgText(group, names.join(' · '), {
          x: position.x, y: position.y - nodeHeight / 2 - 16,
          fill: 'var(--ink)', 'font-family': 'var(--mono)', 'font-size': 11,
          'font-weight': 700, 'text-anchor': 'middle'
        });
        group.appendChild(svgElement('path', {
          d: `M ${position.x} ${position.y - nodeHeight / 2 - 10} L ${position.x} ${position.y - nodeHeight / 2 - 2}`,
          stroke: names.includes('head') ? 'var(--mint)' : 'var(--blue)',
          'stroke-width': 2
        }));
      }

      group.appendChild(svgElement('rect', {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
        width: nodeWidth,
        height: nodeHeight,
        rx: 9,
        fill,
        stroke,
        'stroke-width': names.length || item.state !== 'normal' ? 2 : 1
      }));
      group.appendChild(svgElement('line', {
        x1: position.x + 20, y1: position.y - nodeHeight / 2,
        x2: position.x + 20, y2: position.y + nodeHeight / 2,
        stroke: 'var(--line-strong)', 'stroke-width': 1
      }));
      addSvgText(group, 'data', {
        x: position.x - 17, y: position.y - 9,
        fill: 'var(--muted-2)', 'font-family': 'var(--mono)', 'font-size': 9,
        'text-anchor': 'middle'
      });
      addSvgText(group, String(item.value), {
        x: position.x - 17, y: position.y + 16,
        fill: 'var(--ink-strong)', 'font-family': 'var(--mono)', 'font-size': 17,
        'font-weight': 700, 'text-anchor': 'middle'
      });
      addSvgText(group, 'next', {
        x: position.x + 36, y: position.y + 4,
        fill: 'var(--muted-2)', 'font-family': 'var(--mono)', 'font-size': 9,
        'text-anchor': 'middle'
      });

      if (item.state === 'detached') {
        addSvgText(group, 'detached', {
          x: position.x, y: position.y + nodeHeight / 2 + 22,
          fill: 'var(--amber)', 'font-family': 'var(--sans)', 'font-size': 10,
          'text-anchor': 'middle'
        });
      }

      if (item.state === 'removed') {
        group.appendChild(svgElement('line', {
          x1: position.x - 43, y1: position.y - 21,
          x2: position.x + 43, y2: position.y + 21,
          stroke: 'var(--orange)', 'stroke-width': 2
        }));
        group.appendChild(svgElement('line', {
          x1: position.x + 43, y1: position.y - 21,
          x2: position.x - 43, y2: position.y + 21,
          stroke: 'var(--orange)', 'stroke-width': 2
        }));
        addSvgText(group, 'removed from list', {
          x: position.x, y: position.y + nodeHeight / 2 + 22,
          fill: 'var(--orange)', 'font-family': 'var(--sans)', 'font-size': 10,
          'text-anchor': 'middle'
        });
      }

      elements.svg.appendChild(group);
    });
  };

  const render = () => {
    const { operation, currentStep } = getCurrent();
    elements.labIndex.textContent = operation.index;
    elements.purpose.textContent = operation.purpose;
    elements.title.textContent = operation.title;
    elements.complexity.textContent = operation.complexity;
    elements.stepCount.textContent = `Step ${stepIndex + 1} / ${operation.steps.length}`;
    elements.stepName.textContent = currentStep.name;
    elements.explanation.textContent = currentStep.explanation;
    elements.explanationRow.dataset.tone = currentStep.tone;
    elements.output.textContent = currentStep.output || '—';

    const pointerState = Object.entries(currentStep.pointers || {})
      .map(([name, target]) => `${name} = ${nodeLabel(target)}`)
      .join('  |  ');
    elements.pointers.textContent = pointerState || '—';

    elements.prev.disabled = stepIndex === 0;
    elements.next.disabled = stepIndex === operation.steps.length - 1;
    const progress = ((stepIndex + 1) / operation.steps.length) * 100;
    elements.progress.setAttribute('aria-valuemax', String(operation.steps.length));
    elements.progress.setAttribute('aria-valuenow', String(stepIndex + 1));
    elements.progressFill.style.width = `${progress}%`;

    elements.tabs.querySelectorAll('[role="tab"]').forEach((tab, index) => {
      const selected = index === operationIndex;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    elements.panel.setAttribute('aria-labelledby', `tab-${operation.id}`);

    renderCode(operation.code, currentStep.line);
    renderDiagram(currentStep);
  };

  operations.forEach((operation, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'operation-tab';
    button.id = `tab-${operation.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', 'labPanel');
    button.setAttribute('aria-selected', String(index === 0));
    button.tabIndex = index === 0 ? 0 : -1;
    button.textContent = operation.label;
    button.addEventListener('click', () => {
      operationIndex = index;
      stepIndex = 0;
      render();
    });
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') operationIndex = 0;
      else if (event.key === 'End') operationIndex = operations.length - 1;
      else if (event.key === 'ArrowRight') operationIndex = (operationIndex + 1) % operations.length;
      else operationIndex = (operationIndex - 1 + operations.length) % operations.length;
      stepIndex = 0;
      render();
      elements.tabs.querySelectorAll('[role="tab"]')[operationIndex].focus();
    });
    elements.tabs.appendChild(button);
  });

  elements.prev.addEventListener('click', () => {
    if (stepIndex > 0) {
      stepIndex -= 1;
      render();
    }
  });

  elements.next.addEventListener('click', () => {
    const { operation } = getCurrent();
    if (stepIndex < operation.steps.length - 1) {
      stepIndex += 1;
      render();
    }
  });

  document.addEventListener('keydown', (event) => {
    const activeTag = document.activeElement?.tagName;
    if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'BUTTON') return;
    if (event.key === 'ArrowLeft' && stepIndex > 0) {
      stepIndex -= 1;
      render();
    }
    if (event.key === 'ArrowRight' && stepIndex < getCurrent().operation.steps.length - 1) {
      stepIndex += 1;
      render();
    }
  });

  elements.copy.addEventListener('click', async () => {
    const value = elements.correctCode.textContent;
    try {
      await navigator.clipboard.writeText(value);
      elements.copyLabel.textContent = 'Copied!';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(elements.correctCode);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      elements.copyLabel.textContent = 'Code selected';
    }
    window.setTimeout(() => {
      elements.copyLabel.textContent = 'Copy code';
    }, 1800);
  });

  const resizeObserver = new ResizeObserver((entries) => {
    const width = Math.floor(entries[0]?.contentRect?.width || 0);
    if (width && Math.abs(width - lastCanvasWidth) > 3) {
      lastCanvasWidth = width;
      renderDiagram(getCurrent().currentStep);
    }
  });
  resizeObserver.observe(elements.memoryCanvas);

  render();
})();
