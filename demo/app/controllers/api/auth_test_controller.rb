class Api::AuthTestController < ApplicationController
  before_action :authenticate_user!

  def index
    render json: { is_authenicated: user_signed_in? }
  end
end
