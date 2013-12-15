class Image < ActiveRecord::Base
    has_and_belongs_to_many :issues
	has_one :text_index
end
