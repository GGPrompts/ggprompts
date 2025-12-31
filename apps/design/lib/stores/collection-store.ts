import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import { Collection, SavedComponent } from '@/types/collection';

type CollectionStore = {
  collections: Collection[];
  addCollection: (collection: Collection) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  removeCollection: (id: string) => void;
  duplicateCollection: (id: string) => Collection | undefined;
  addComponentToCollection: (collectionId: string, component: SavedComponent) => void;
  removeComponentFromCollection: (collectionId: string, componentId: string) => void;
  updateComponentInCollection: (
    collectionId: string,
    componentId: string,
    updates: Partial<SavedComponent>
  ) => void;
  reorderComponents: (collectionId: string, componentIds: string[]) => void;
  getCollection: (id: string) => Collection | undefined;
  getAllTags: () => string[];
};

export const useCollectionStore = create<CollectionStore>()(
  devtools(
    persist(
      (set, get) => ({
        collections: [],

        addCollection: (collection) =>
          set((state) => ({
            collections: [...state.collections, collection],
          })),

        updateCollection: (id, updates) =>
          set((state) => ({
            collections: state.collections.map((c) =>
              c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
            ),
          })),

        removeCollection: (id) =>
          set((state) => ({
            collections: state.collections.filter((c) => c.id !== id),
          })),

        duplicateCollection: (id) => {
          const collection = get().collections.find((c) => c.id === id);
          if (!collection) return undefined;

          const newCollection: Collection = {
            ...collection,
            id: crypto.randomUUID(),
            name: `${collection.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date(),
            components: collection.components.map((comp) => ({
              ...comp,
              id: crypto.randomUUID(),
            })),
          };

          set((state) => ({
            collections: [...state.collections, newCollection],
          }));

          return newCollection;
        },

        addComponentToCollection: (collectionId, component) =>
          set((state) => ({
            collections: state.collections.map((c) =>
              c.id === collectionId
                ? {
                    ...c,
                    components: [...c.components, component],
                    updatedAt: new Date(),
                  }
                : c
            ),
          })),

        removeComponentFromCollection: (collectionId, componentId) =>
          set((state) => ({
            collections: state.collections.map((c) =>
              c.id === collectionId
                ? {
                    ...c,
                    components: c.components.filter((comp) => comp.id !== componentId),
                    updatedAt: new Date(),
                  }
                : c
            ),
          })),

        updateComponentInCollection: (collectionId, componentId, updates) =>
          set((state) => ({
            collections: state.collections.map((c) =>
              c.id === collectionId
                ? {
                    ...c,
                    components: c.components.map((comp) =>
                      comp.id === componentId ? { ...comp, ...updates } : comp
                    ),
                    updatedAt: new Date(),
                  }
                : c
            ),
          })),

        reorderComponents: (collectionId, componentIds) =>
          set((state) => ({
            collections: state.collections.map((c) => {
              if (c.id !== collectionId) return c;

              const reordered = componentIds
                .map((id, index) => {
                  const comp = c.components.find((comp) => comp.id === id);
                  return comp ? { ...comp, order: index } : null;
                })
                .filter(Boolean) as SavedComponent[];

              return {
                ...c,
                components: reordered,
                updatedAt: new Date(),
              };
            }),
          })),

        getCollection: (id) => get().collections.find((c) => c.id === id),

        getAllTags: () => {
          const tags = new Set<string>();
          get().collections.forEach((c) => c.tags.forEach((tag) => tags.add(tag)));
          return Array.from(tags).sort();
        },
      }),
      {
        name: 'design2prompt-collections',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ collections: state.collections }),
      }
    ),
    { name: 'CollectionStore' }
  )
);
