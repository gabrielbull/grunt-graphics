#!/bin/bash
{
cat <<EOF
(define (convert-psd-to-jpg src dest)
  (let* 
    (
      (image (car (file-psd-load RUN-NONINTERACTIVE src src)))
	    (drawable (car (gimp-image-get-active-drawable image)))
	    (img_width nil)
	    (img_height nil)
	    (new_layer nil)
	    (merged_layers nil)
    )
    (set! img_width (car (gimp-image-width image)))
    (set! img_height (car (gimp-image-height image)))
     
    ;; Create new layer the size of the image and fill it with transparent to create
    ;; a drawable the size of the image
    (set! new_layer (car (gimp-layer-new image img_width img_height RGBA-IMAGE "new_layer" 100 NORMAL-MODE)))
    (gimp-image-insert-layer image new_layer 0 0)
    (gimp-drawable-fill new_layer TRANSPARENT-FILL)
    (gimp-image-lower-item image new_layer)
    
    ;; Merge all layers into the newly created transparent layer
    (set! merged_layers (car (gimp-image-merge-visible-layers image EXPAND-AS-NECESSARY)))

    (file-jpeg-save RUN-NONINTERACTIVE image merged_layers dest dest 1 0 0 0 "" 0 0 0 0)
    (gimp-image-delete image)
  )
)
EOF

echo "(convert-psd-to-jpg \"$2\" \"$3\")"

echo "(gimp-quit 0)"
} | $1 -i -b -
