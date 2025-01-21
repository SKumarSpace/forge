import { useQuery } from "@tanstack/react-query";
import { TEditorConfiguration } from "../../documents/editor/core";

export function useTemplateStore() {
  const { data: templateNames } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      const response = await fetch('http://localhost:8080/list');
      return await response.json() as string[];
    }
  })

  return templateNames;
}

export function useTemplateContent(name: string) {
  const { data: templateContent } = useQuery({
    queryKey: ["templateContent", name],
    queryFn: async () => {
      const filename = name.replace("#template?name=", "");
      const response = await fetch('http://localhost:8080/get?filename=' + filename);
      return await response.json() as TEditorConfiguration;
    },
    enabled: name.startsWith("#template") && name.endsWith(".json"),
    staleTime: Infinity,
  })

  return templateContent;
}
