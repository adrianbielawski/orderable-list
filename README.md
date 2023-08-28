# Orderable list

## Quick start

`$ npm i @adrianbielawski/orderable-list`

[See examples](https://components.adrian.bielaw.ski/?path=/story/orderable-list-examples--primary)

```tsx
import OrderableList, {
  OnDropParams,
  OnRemoveParams,
} from "@adrianbielawski/orderable-list";
import ToDoItem from "./toDoItem";

const initialItems = ["Buy something", "Take a walk"];

const ToDoList = () => {
  const [items, setItems] = useState<string[]>(initialItems);

  const handleAdd = (value: string) => {
    setItems([value, ...items]);
  };

  const handleDrop = (params: OnDropParams<string>) => {
    setItems(params.newItems);
  };

  const handleRemove = (params: OnRemoveParams<string>) => {
    setItems(params.newItems);
  };

  return (
    <>
      <YourFancyForm onSubmit={handleAdd} />
      <OrderableList
        items={items}
        itemComponent={ToDoItem}
        onDrop={handleDrop}
        onRemove={handleRemove}
      />
    </>
  );
};
```

## Orderable list props

| Name               | Type              | Description                                                                                                                                                         |
| ------------------ | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| items              | any[]             | Array of items displayed on the list.                                                                                                                               |
| itemComponent      | React component   | Learn more in [ItemComponent](?path=/story/orderable-list-docs-itemcomponent--page) docs.                                                                           |
| className          | string            | Class name for `<ul>` element.                                                                                                                                      |
| itemClassName      | string            | Class name for `<li>` element.                                                                                                                                      |
| animationDirection | 'right' or 'left' | Direction of animation on removed item. Initial 'left'.                                                                                                             |
| scrollTopAt        | number            | Scroll `body` when grabbed element reach `n` pixels from the top. Initial 30.                                                                                       |
| scrollBottomAt     | number            | Scroll `body` when grabbed element reach `n` pixels from the bottom. Initial 30.                                                                                    |
| onDrop             | function          | Use it to change your state of list items after reordering. Function takes `params: OnDropParams<T>` object with `{ newPosition: number, item: T, newItems: T[] }`. |
| onRemove           | function          | Use it to change your state of list items after removing. Function takes `params: OnRemoveParams<T>` object with `{ item: T, newItems: T[] }`.                      |

## Item component

Create your `ItemComponent` which optionally contains `Grabbable` and `RemoveButton`:

```tsx
import OrderableList, {
  ItemComponentProps,
} from "@adrianbielawski/orderable-list";

const ToDoItem = (props: ItemComponentProps<string>) => (
  <OrderableList.Grabbable className="to-do-item">
    {params.item}
    <OrderableList.RemoveButton className="remove-button">
      Remove
    </OrderableList.RemoveButton>
  </OrderableList.Grabbable>
);

export default ToDoItem;
```

[See examples](https://components.adrian.bielaw.ski/?path=/story/orderable-list-examples--primary) for different scenarios

## ItemComponent takes following props

| Name    | Type    | Description                                         |
| ------- | ------- | --------------------------------------------------- |
| item    | any     | Item from the `items` array passed to OrderableList |
| index   | number  | Current position on the list starts from 0          |
| grabbed | boolean | `true` if user grab this item                       |
