FilePond.registerPlugin(
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode
);

FilePond.setOptions({
  stylePanelAspectRatio: 150 / 100, // default
  imageResizeTargetWidth: 100,
  imageResizeTargetHeight: 150, // fixed typo
});

FilePond.parse(document.body);
