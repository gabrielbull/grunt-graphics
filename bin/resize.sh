#!/bin/bash
{
cat <<EOF
(define (resize src dest new_width new_height)
  (let* 
    (
      (image (car (file-png-load RUN-NONINTERACTIVE src src)))
	    (drawable (car (gimp-image-get-active-layer image)))
	    (img_width nil)
	    (img_height nil)
	    (width_diff nil)
	    (height_diff nil)
	    (use_height 0)
	    (use_width 0)
	    (ratio nil)
    )

    ;; Check if we use width or height for ratio
    (set! img_width (car (gimp-image-width image)))
    (set! img_height (car (gimp-image-height image)))
    
    (if (not (equal? new_width nil))
      (set! width_diff (/ img_width new_width))
      (set! use_height 1)
    )  
    
    (if (not (equal? new_height nil))
      (set! height_diff (/ img_height new_height))
      (set! use_width 1)
    )
            
    (if (not (= use_width 1)) (and (not (= use_height 1)) (and (>= width_diff height_diff)))
      (set! use_width 1)
    )
    
    (if (not (= use_width 1)) (and (not (= use_height 1)) (and (> height_diff width_diff)))
      (set! use_height 1)
    )
    
    ;; Get Ratio
    (if (= use_width 1)
      (set! ratio width_diff)
      (set! ratio height_diff)
    )
    
    ;; Get final height and width
    (if (= use_width 1)
      (set! new_height (round (/ img_height ratio)))
      (set! new_width (round (/ img_width ratio)))
    )
    
    ;; Do resize image
    (gimp-image-scale image new_width new_height)
    (file-png-save-defaults RUN-NONINTERACTIVE image drawable dest dest)
    (gimp-image-delete image)
  )
)
EOF

echo "(resize \"$2\" \"$3\" $4 $5)"

echo "(gimp-quit 0)"
} | $1 -i -b -
