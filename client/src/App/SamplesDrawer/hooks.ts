import { useQuery } from '@tanstack/react-query';
import { TEditorConfiguration } from '../../documents/editor/core';
import { api } from '../utils';
import { nanoid } from 'nanoid';

export function useTemplateStore() {
  const { data: templateNames } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => await api.get('list').json<{
      [key: string]: string;
    }>(),
  });

  return templateNames;
}

export function useNanoid() {
    const templates = useTemplateStore();
    const nonNullTemplates = templates ? Object.keys(templates) : [];
    const generate = () => {
      let uniqueId: string;
      do {
        uniqueId = nanoid(10);
      } while (nonNullTemplates.some(template => template === uniqueId));
      return uniqueId;
    }

    return generate;
}

export function useTemplateContent(name: string) {
  const { data: templateContent } = useQuery({
    queryKey: ['templateContent', name],
    queryFn: async () => {
      const filename = name.replace('#template?name=', '');
      return await api.get('get?filename=' + filename).json<TEditorConfiguration>();
    },
    enabled: name.startsWith('#template') && name.endsWith('.json'),
    staleTime: Infinity,
  });

  return templateContent;
}

export function useImageStore() {
  const { data: images, ...other } = useQuery({
    queryKey: ['templatesj'],
    queryFn: async () =>
      await api.get('images/list').json<{
        [key: string]: string;
      }>(),
  });

  return { images, ...other };
}
