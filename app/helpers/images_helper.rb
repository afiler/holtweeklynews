module ImagesHelper
	def get_pos(search_string, loc)
		rollImg = loc.split('/')
		f = File.open("fulltextdb/#{rollImg[0]}/csv/#{rollImg[1]}.csv")
		lines = []
		f.readlines().each { |l| lines << l.split(',') }
		text = []
		for line in lines
			if line[0].length == 1
				text << line[0].downcase
			else
				text << ' '
			end
		end
	
		text = text.join('')
		pos = text.index(@params[:search_text].downcase)
		if !pos then return [0,0,0,0,0,0] end
		end_pos = pos + @params[:search_text].length - 1

		start_x = lines[pos][1].to_f
		start_y = lines[pos][2].to_f
		end_x = lines[end_pos][1].to_f
		end_y = lines[end_pos][2].to_f
		w = lines[pos][3].to_f
		h = lines[pos][4].to_f
		return [start_x, start_y, end_x, end_y, h, w]
	end
end
