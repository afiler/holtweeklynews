class TextIndex < ActiveRecord::Base
	has_one :image
	#acts_as_ferret
end
