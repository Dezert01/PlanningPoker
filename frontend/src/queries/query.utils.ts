import { QueryClient } from "@tanstack/react-query";

export function updateListItem<T extends { id: number }>(
  queryClient: QueryClient,
  key: string[],
  itemId: number,
  fields: Partial<T> | ((oldData: T) => T),
) {
  queryClient.setQueryData<T[]>(key, (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.map((item) => {
      if (item.id === itemId) {
        if (typeof fields === "function") {
          return fields(item);
        }
        return {
          ...item,
          ...fields,
        };
      }
      return item;
    });
  });
}

export function deleteListItem<T extends {}>(
  queryClient: QueryClient,
  key: string[],
  filterFn: (item: T) => boolean,
) {
  queryClient.setQueryData<T[]>(key, (oldData) => {
    if (!oldData) {
      return oldData;
    }
    return oldData.filter(filterFn);
  });
}

export function addListItem<T extends {}>(
  queryClient: QueryClient,
  key: string[],
  newItem: T,
) {
  queryClient.setQueryData<T[]>(key, (oldData) => {
    console.log(oldData);
    if (!oldData) {
      return oldData;
    }
    console.log("NEW DATA", [...oldData, newItem]);
    return [...oldData, newItem];
  });
}
