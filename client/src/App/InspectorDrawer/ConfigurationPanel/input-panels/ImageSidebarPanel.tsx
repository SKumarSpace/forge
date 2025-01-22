import { useState } from 'react';

import {
  VerticalAlignBottomOutlined,
  VerticalAlignCenterOutlined,
  VerticalAlignTopOutlined,
} from '@mui/icons-material';
import { Button, ImageList, ImageListItem, Stack, styled, ToggleButton } from '@mui/material';
import { ImageProps, ImagePropsSchema } from '@usewaypoint/block-image';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import RadioGroupInput from './helpers/inputs/RadioGroupInput';
import TextDimensionInput from './helpers/inputs/TextDimensionInput';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';
import { useImageStore } from '../../../SamplesDrawer/hooks';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../../utils';
import ControlledTextInput from './helpers/inputs/ControlledTextInput';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type ImageSidebarPanelProps = {
  data: ImageProps;
  setData: (v: ImageProps) => void;
};
export default function ImageSidebarPanel({ data, setData }: ImageSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = ImagePropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const { mutate } = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);

      const x = await api
        .post(`images/upload?filename=${file.name}`, {
          body: formData,
        })
        .text();

      console.log(x);
    },
    onSuccess: () => refetch(),
  });

  const { images, refetch } = useImageStore();

  const url = data.props?.url;
  console.log('url', url);

  return (
    <BaseSidebarPanel title="Image block">
      <ControlledTextInput
        label="Source URL"
        value={data.props?.url ?? ''}
        onChange={(v) => {
          const url = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, url } });
        }}
      />
      <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
        Upload files
        <VisuallyHiddenInput type="file" onChange={(event) => event.target.files && mutate(event.target.files[0])} />
      </Button>
      {images && (
        <ImageList sx={{ height: 450 }} cols={2} rowHeight={100}>
          {Object.entries(images).map((item) => (
            <ImageListItem
              key={item[0]}
              onClick={() => updateData({ ...data, props: { ...data.props, url: item[1] } })}
            >
              <img
                src={item[1]}
                alt={item[0]}
                loading="lazy"
                width={100}
                height={100}
                style={{ borderRadius: '0.25rem', border: '1px solid black' }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      )}
      <TextInput
        label="Alt text"
        defaultValue={data.props?.alt ?? ''}
        onChange={(alt) => updateData({ ...data, props: { ...data.props, alt } })}
      />
      <TextInput
        label="Click through URL"
        defaultValue={data.props?.linkHref ?? ''}
        onChange={(v) => {
          const linkHref = v.trim().length === 0 ? null : v.trim();
          updateData({ ...data, props: { ...data.props, linkHref } });
        }}
      />
      <Stack direction="row" spacing={2}>
        <TextDimensionInput
          label="Width"
          defaultValue={data.props?.width}
          onChange={(width) => updateData({ ...data, props: { ...data.props, width } })}
        />
        <TextDimensionInput
          label="Height"
          defaultValue={data.props?.height}
          onChange={(height) => updateData({ ...data, props: { ...data.props, height } })}
        />
      </Stack>

      <RadioGroupInput
        label="Alignment"
        defaultValue={data.props?.contentAlignment ?? 'middle'}
        onChange={(contentAlignment) => updateData({ ...data, props: { ...data.props, contentAlignment } })}
      >
        <ToggleButton value="top">
          <VerticalAlignTopOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="middle">
          <VerticalAlignCenterOutlined fontSize="small" />
        </ToggleButton>
        <ToggleButton value="bottom">
          <VerticalAlignBottomOutlined fontSize="small" />
        </ToggleButton>
      </RadioGroupInput>

      <MultiStylePropertyPanel
        names={['backgroundColor', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
